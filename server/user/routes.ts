import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { z } from "zod";
import { changePasswordSchema, updateDisplayNameSchema, type User } from "@shared/schema";
import { storage } from "../storage";
import { sendEmailVerificationEmail } from "../services/email";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const router = Router();

const BCRYPT_ROUNDS = 12;
const TOKEN_EXPIRY_HOURS = 24;

function requireAuth(req: Request, res: Response, next: () => void) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

router.post("/change-email", requireAuth, async (req: Request, res: Response) => {
  try {
    const { newEmail } = req.body;
    const user = req.user as User;

    if (!newEmail || typeof newEmail !== "string") {
      return res.status(400).json({ message: "New email is required" });
    }

    const emailSchema = z.string().email();
    const parseResult = emailSchema.safeParse(newEmail);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (newEmail === user.email) {
      return res.status(400).json({ message: "New email must be different from current email" });
    }

    const existingUser = await storage.getUserByEmail(newEmail);
    if (existingUser) {
      return res.status(400).json({ message: "This email is already in use" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await storage.createEmailVerificationToken(user.id, newEmail, token, expiresAt);

    sendEmailVerificationEmail({ email: newEmail, token }).catch((err) => {
      console.error("Failed to send email verification:", err);
    });

    return res.json({ data: { message: "Verification email sent to " + newEmail } });
  } catch (error) {
    console.error("Change email error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/verify-email/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const verificationToken = await storage.getEmailVerificationToken(token);

    if (!verificationToken) {
      return res.status(400).json({ message: "Invalid or expired verification link", valid: false });
    }

    if (new Date() > verificationToken.expiresAt) {
      return res.status(400).json({ message: "This verification link has expired", valid: false });
    }

    const existingUser = await storage.getUserByEmail(verificationToken.newEmail);
    if (existingUser) {
      return res.status(400).json({ message: "This email is already in use by another account" });
    }

    await storage.updateUserEmail(verificationToken.userId, verificationToken.newEmail);
    await storage.deleteEmailVerificationToken(verificationToken.id);

    return res.json({ data: { message: "Email updated successfully", newEmail: verificationToken.newEmail } });
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/change-password", requireAuth, async (req: Request, res: Response) => {
  try {
    const validatedData = changePasswordSchema.parse(req.body);
    const user = req.user as User;

    const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const passwordHash = await bcrypt.hash(validatedData.newPassword, BCRYPT_ROUNDS);
    await storage.updateUserPassword(user.id, passwordHash);

    return res.json({ data: { message: "Password updated successfully" } });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }

    console.error("Change password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/reviews", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    const { reviews, total } = await storage.getReviewsByUserId(user.id, page, limit);

    return res.json({
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get user reviews error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/preferences", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { emailNotifications } = req.body;

    if (typeof emailNotifications !== "boolean") {
      return res.status(400).json({ message: "emailNotifications must be a boolean" });
    }

    await storage.updateUserNotifications(user.id, emailNotifications);

    return res.json({
      data: {
        message: "Preferences updated successfully",
        emailNotifications,
      },
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/display-name", requireAuth, async (req: Request, res: Response) => {
  try {
    const validatedData = updateDisplayNameSchema.parse(req.body);
    const user = req.user as User;

    // Normalize empty string to null
    const displayName = validatedData.displayName?.trim() || null;

    await storage.updateUserDisplayName(user.id, displayName);

    return res.json({
      data: {
        message: "Display name updated successfully",
        displayName,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }

    console.error("Update display name error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/account", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as User;

    await storage.deleteUser(user.id);

    req.logout((err) => {
      if (err) {
        console.error("Logout error during account deletion:", err);
      }
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          console.error("Session destroy error:", sessionErr);
        }
        res.clearCookie("connect.sid");
        return res.json({ data: { message: "Account deleted successfully" } });
      });
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
