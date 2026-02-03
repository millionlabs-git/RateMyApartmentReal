import { Router, type Request, type Response } from "express";
import { storage } from "../storage";
import { z } from "zod";

const router = Router();

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// POST /api/waitlist - Public endpoint for joining waitlist
router.post("/", async (req: Request, res: Response) => {
  try {
    const result = waitlistSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: result.error.errors[0]?.message || "Invalid email format"
      });
    }

    const { email } = result.data;

    // Check if email already exists
    const existingEntry = await storage.getWaitlistEntryByEmail(email);
    if (existingEntry) {
      // Return success even if already exists (don't reveal if email is in list)
      return res.json({
        message: "Thanks! We'll notify you when we launch."
      });
    }

    await storage.createWaitlistEntry(email);

    return res.json({
      message: "Thanks! We'll notify you when we launch."
    });
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

export default router;
