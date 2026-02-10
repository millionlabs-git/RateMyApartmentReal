import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import passport from "passport";
import { signupSchema, resetPasswordSchema, type User } from "@shared/schema";
import { storage } from "../storage";
import { sendWelcomeEmail, sendPasswordResetEmail, sendEmailVerificationEmail } from "../services/email";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const router = Router();

const BCRYPT_ROUNDS = 12;
const TOKEN_EXPIRY_HOURS = 24;

function getSafeUser(user: User): Omit<User, "passwordHash"> {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: Error | null, user: User | false, info: { message: string } | undefined) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || "Invalid email or password" });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.json({ data: getSafeUser(user) });
    });
  })(req, res, next);
});

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const validatedData = signupSchema.parse(req.body);

    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(validatedData.password, BCRYPT_ROUNDS);

    const user = await storage.createUser({
      email: validatedData.email,
      passwordHash,
    });

    sendWelcomeEmail({ email: user.email }).catch((err) => {
      console.error("Failed to send welcome email:", err);
    });

    // Send email verification
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
    await storage.createEmailVerificationToken(user.id, user.email, verificationToken, verificationExpiresAt);
    sendEmailVerificationEmail({ email: user.email, token: verificationToken }).catch((err) => {
      console.error("Failed to send email verification:", err);
    });

    req.login(user, (err) => {
      if (err) {
        console.error("Session creation error:", err);
        return res.status(500).json({ message: "Account created but session failed" });
      }

      const { passwordHash: _, ...safeUser } = user;

      return res.status(201).json({ data: safeUser });
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }

    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/me", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  return res.json({ data: getSafeUser(req.user as User) });
});

router.post("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    return res.json({ data: { message: "Logged out successfully" } });
  });
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await storage.getUserByEmail(email);

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

      await storage.createPasswordResetToken(user.id, token, expiresAt);

      sendPasswordResetEmail({ email: user.email, token }).catch((err) => {
        console.error("Failed to send password reset email:", err);
      });
    }

    return res.json({ data: { message: "If an account exists with this email, you will receive a password reset link." } });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/reset-password/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const resetToken = await storage.getPasswordResetToken(token);

    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired reset link", valid: false });
    }

    if (resetToken.usedAt) {
      return res.status(400).json({ message: "This reset link has already been used", valid: false });
    }

    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({ message: "This reset link has expired. Please request a new one.", valid: false });
    }

    return res.json({ data: { valid: true } });
  } catch (error) {
    console.error("Validate reset token error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);

    const resetToken = await storage.getPasswordResetToken(validatedData.token);

    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    if (resetToken.usedAt) {
      return res.status(400).json({ message: "This reset link has already been used" });
    }

    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({ message: "This reset link has expired. Please request a new one." });
    }

    const passwordHash = await bcrypt.hash(validatedData.password, BCRYPT_ROUNDS);

    await storage.updateUserPassword(resetToken.userId, passwordHash);
    await storage.markTokenUsed(resetToken.id);

    const user = await storage.getUser(resetToken.userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    req.login(user, (err) => {
      if (err) {
        console.error("Session creation error after password reset:", err);
        return res.json({ data: { message: "Password reset successful. Please log in." } });
      }
      return res.json({ data: { message: "Password reset successful", user: getSafeUser(user) } });
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }

    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Verify email for signup (not email change)
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

    await storage.updateUserEmailVerified(verificationToken.userId, true);
    await storage.deleteEmailVerificationToken(verificationToken.id);

    return res.json({ data: { verified: true } });
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Resend verification email
router.post("/resend-verification", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = req.user as User;

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await storage.createEmailVerificationToken(user.id, user.email, token, expiresAt);

    sendEmailVerificationEmail({ email: user.email, token }).catch((err) => {
      console.error("Failed to send email verification:", err);
    });

    return res.json({ data: { message: "Verification email sent" } });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
