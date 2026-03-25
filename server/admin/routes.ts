import { Router, Request, Response } from "express";
import crypto from "crypto";
import { storage } from "../storage";
import { type User } from "@shared/schema";
import { detectAndQueueDuplicates } from "../services/duplicate-detection";
import {
  sendReviewApprovedEmail,
  sendReviewRejectedEmail,
  sendBuildingApprovedEmail,
  sendBuildingRejectedEmail,
  sendPasswordResetEmail,
} from "../services/email";

const router = Router();

// Middleware to require admin role
function requireAdmin(req: Request, res: Response, next: () => void) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const user = req.user as User;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  next();
}

// Apply requireAdmin to all routes in this router
router.use(requireAdmin);

// Dashboard stats
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const stats = await storage.getAdminStats();
    return res.json({ data: stats });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users with pagination
router.get("/users", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || "";

    const { users, total } = await storage.getAllUsers(search, page, limit);

    return res.json({
      data: users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update user status
router.patch("/users/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const currentUser = req.user as User;

    if (!["active", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Prevent admins from suspending themselves
    if (id === currentUser.id && status === "suspended") {
      return res.status(400).json({ message: "You cannot suspend your own account" });
    }

    await storage.updateUserStatus(id, status);
    return res.json({ message: "User status updated" });
  } catch (error) {
    console.error("Update user status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const TOKEN_EXPIRY_HOURS = 24;

// Send password reset email for a user (admin-triggered)
router.post("/users/:id/reset-password", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await storage.createPasswordResetToken(user.id, token, expiresAt);

    const emailSent = await sendPasswordResetEmail({ email: user.email, token });

    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send password reset email" });
    }

    return res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Admin reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all reviews with filtering (for moderation of auto-approved content)
router.get("/reviews", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "all";

    const { reviews, total } = await storage.getAllReviewsAdmin(search, status, page, limit);

    return res.json({
      data: reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get pending reviews
router.get("/reviews/pending", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { reviews, total } = await storage.getPendingReviews(page, limit);

    return res.json({
      data: reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get pending reviews error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Approve/deny review
router.patch("/reviews/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!["approved", "denied"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Get review details before updating for email notification
    const review = await storage.getReviewWithDetails(id);
    const wasApproved = review?.status === "approved";

    await storage.updateReviewStatus(id, status);

    // Send email notification if we have review details
    if (review) {
      const building = await storage.getBuilding(review.buildingId);

      if (status === "approved" && building) {
        sendReviewApprovedEmail({
          email: review.userEmail,
          buildingName: building.name || building.address,
          buildingAddress: building.address,
          buildingId: building.id,
        }).catch(err => console.error("Failed to send review approved email:", err));
      } else if (status === "denied") {
        const removalReason = wasApproved
          ? "Your review was removed because it violated our community guidelines."
          : reason;
        sendReviewRejectedEmail({
          email: review.userEmail,
          buildingName: review.buildingName,
          reason: removalReason,
        }).catch(err => console.error("Failed to send review rejected email:", err));
      }
    }

    return res.json({ message: "Review status updated" });
  } catch (error) {
    console.error("Update review status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all buildings with pagination and filters
router.get("/buildings", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "all";

    const { buildings, total } = await storage.getAllBuildingsAdmin(search, status, page, limit);

    return res.json({
      data: buildings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get all buildings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get pending buildings
router.get("/buildings/pending", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { buildings, total } = await storage.getPendingBuildings(page, limit);

    return res.json({
      data: buildings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get pending buildings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get single building for editing
router.get("/buildings/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const building = await storage.getBuilding(id);

    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    return res.json({ data: building });
  } catch (error) {
    console.error("Get building error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update building data
router.put("/buildings/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, zip, neighborhood, landlord, buildingType } = req.body;

    const building = await storage.getBuilding(id);
    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    // Prevent editing denied buildings
    if (building.status === "denied") {
      return res.status(400).json({ message: "Cannot edit denied buildings" });
    }

    const nameChanged = name && name !== building.name;
    const addressChanged = address && address !== building.address;

    const updatedBuilding = await storage.updateBuilding(id, {
      name: name ?? building.name,
      address: address ?? building.address,
      zip: zip ?? building.zip,
      neighborhood: neighborhood !== undefined ? neighborhood : building.neighborhood,
      landlord: landlord !== undefined ? landlord : building.landlord,
      buildingType: buildingType !== undefined ? buildingType : building.buildingType,
    });

    // Re-run duplicate detection if name or address changed on an approved building
    if ((nameChanged || addressChanged) && building.status === "approved") {
      detectAndQueueDuplicates(id).catch((err) =>
        console.error("Duplicate detection after edit error:", err)
      );
    }

    return res.json({ data: updatedBuilding, message: "Building updated successfully" });
  } catch (error) {
    console.error("Update building error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete building
router.delete("/buildings/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as User;

    const building = await storage.getBuilding(id);
    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    await storage.deleteBuilding(id, user.id);
    return res.json({ message: "Building deleted successfully" });
  } catch (error) {
    console.error("Delete building error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Approve/deny building
router.patch("/buildings/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "denied"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Get building before updating to find submitter
    const building = await storage.getBuilding(id);
    const wasApproved = building?.status === "approved";

    await storage.updateBuildingStatus(id, status);

    // Trigger duplicate detection on approval
    if (status === "approved") {
      detectAndQueueDuplicates(id).catch((err) =>
        console.error("Duplicate detection error:", err)
      );
    }

    // Send email notification to the user who submitted the building
    if (building?.submittedBy) {
      const submitter = await storage.getUser(building.submittedBy);
      if (submitter?.emailNotifications) {
        if (status === "approved" && !wasApproved) {
          sendBuildingApprovedEmail({
            email: submitter.email,
            buildingName: building.name || building.address,
            buildingAddress: building.address,
            buildingId: building.id,
          }).catch((err) => console.error("Failed to send building approved email:", err));
        } else if (status === "denied") {
          sendBuildingRejectedEmail({
            email: submitter.email,
            buildingName: building.name || building.address,
            reason: wasApproved
              ? "Your residence listing was removed because it violated our submission guidelines."
              : undefined,
          }).catch((err) => console.error("Failed to send building rejected email:", err));
        }
      }
    }

    return res.json({ message: "Building status updated" });
  } catch (error) {
    console.error("Update building status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Bulk approve/deny reviews
router.post("/reviews/bulk-action", async (req: Request, res: Response) => {
  try {
    const { ids, action, reason } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }
    if (!["approve", "deny"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const status = action === "approve" ? "approved" : "denied";

    // Get review details before updating for email notifications
    const reviewDetails = await Promise.all(
      ids.map(id => storage.getReviewWithDetails(id))
    );

    await storage.bulkUpdateReviewStatus(ids, status);

    // Send email notifications
    for (const review of reviewDetails) {
      if (!review) continue;

      const building = await storage.getBuilding(review.buildingId);

      if (status === "approved" && building) {
        sendReviewApprovedEmail({
          email: review.userEmail,
          buildingName: building.name || building.address,
          buildingAddress: building.address,
          buildingId: building.id,
        }).catch(err => console.error("Failed to send review approved email:", err));
      } else if (status === "denied") {
        sendReviewRejectedEmail({
          email: review.userEmail,
          buildingName: review.buildingName,
          reason: reason,
        }).catch(err => console.error("Failed to send review rejected email:", err));
      }
    }

    return res.json({ message: `${ids.length} reviews ${status}` });
  } catch (error) {
    console.error("Bulk review action error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Bulk approve/deny buildings
router.post("/buildings/bulk-action", async (req: Request, res: Response) => {
  try {
    const { ids, action } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }
    if (!["approve", "deny"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const status = action === "approve" ? "approved" : "denied";

    // Get building details before updating for email notifications
    const buildingDetails = await Promise.all(
      ids.map((id) => storage.getBuilding(id))
    );

    await storage.bulkUpdateBuildingStatus(ids, status);

    // Send email notifications to submitters
    for (const building of buildingDetails) {
      if (!building?.submittedBy) continue;

      const submitter = await storage.getUser(building.submittedBy);
      if (!submitter?.emailNotifications) continue;

      if (status === "approved") {
        sendBuildingApprovedEmail({
          email: submitter.email,
          buildingName: building.name || building.address,
          buildingAddress: building.address,
          buildingId: building.id,
        }).catch((err) => console.error("Failed to send building approved email:", err));
      } else {
        sendBuildingRejectedEmail({
          email: submitter.email,
          buildingName: building.name || building.address,
        }).catch((err) => console.error("Failed to send building rejected email:", err));
      }
    }

    return res.json({ message: `${ids.length} buildings ${status}` });
  } catch (error) {
    console.error("Bulk building action error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get pending duplicates count
router.get("/duplicates/count", async (req: Request, res: Response) => {
  try {
    const count = await storage.getPendingDuplicatesCount();
    return res.json({ data: { count } });
  } catch (error) {
    console.error("Get duplicates count error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get pending duplicates list
router.get("/duplicates", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { duplicates, total } = await storage.getPendingDuplicates(page, limit);

    return res.json({
      data: duplicates,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get duplicates error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get single duplicate pair details
router.get("/duplicates/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pair = await storage.getDuplicatePair(id);

    if (!pair) {
      return res.status(404).json({ message: "Duplicate pair not found" });
    }

    return res.json({ data: pair });
  } catch (error) {
    console.error("Get duplicate pair error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Dismiss duplicate pair
router.patch("/duplicates/:id/dismiss", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pair = await storage.getDuplicatePair(id);
    if (!pair) {
      return res.status(404).json({ message: "Duplicate pair not found" });
    }

    await storage.updateDuplicateStatus(id, "dismissed");
    return res.json({ message: "Duplicate pair dismissed" });
  } catch (error) {
    console.error("Dismiss duplicate error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Merge buildings
router.post("/duplicates/:id/merge", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { masterId } = req.body;

    if (!masterId) {
      return res.status(400).json({ message: "Master building ID is required" });
    }

    const pair = await storage.getDuplicatePair(id);
    if (!pair) {
      return res.status(404).json({ message: "Duplicate pair not found" });
    }

    // Validate masterId is one of the two buildings
    if (masterId !== pair.building1.id && masterId !== pair.building2.id) {
      return res.status(400).json({ message: "Invalid master building ID" });
    }

    const secondaryId = masterId === pair.building1.id ? pair.building2.id : pair.building1.id;
    const user = req.user as User;

    await storage.mergeBuildings(masterId, secondaryId, user.id);
    await storage.updateDuplicateStatus(id, "merged");

    return res.json({ message: "Buildings merged successfully" });
  } catch (error) {
    console.error("Merge buildings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// =====================
// Waitlist Management
// =====================

// Get waitlist entries with pagination
router.get("/waitlist", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || "";

    const { entries, total } = await storage.getWaitlistEntries(search, page, limit);

    return res.json({
      data: entries,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get waitlist entries error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get waitlist count for dashboard
router.get("/waitlist/count", async (req: Request, res: Response) => {
  try {
    const count = await storage.getWaitlistCount();
    return res.json({ data: { count } });
  } catch (error) {
    console.error("Get waitlist count error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Export waitlist as CSV
router.get("/waitlist/export", async (req: Request, res: Response) => {
  try {
    // Get all entries (no pagination for export)
    const { entries } = await storage.getWaitlistEntries("", 1, 100000);

    // Build CSV content
    const csvHeader = "Email,Signed Up\n";
    const csvRows = entries.map(entry => {
      const date = new Date(entry.createdAt).toISOString();
      return `"${entry.email}","${date}"`;
    }).join("\n");

    const csv = csvHeader + csvRows;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="waitlist-${new Date().toISOString().split("T")[0]}.csv"`);
    return res.send(csv);
  } catch (error) {
    console.error("Export waitlist error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete waitlist entry
router.delete("/waitlist/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await storage.deleteWaitlistEntry(id);
    return res.json({ message: "Waitlist entry deleted" });
  } catch (error) {
    console.error("Delete waitlist entry error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
