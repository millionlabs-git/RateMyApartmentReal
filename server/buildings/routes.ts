import { Router, Request, Response } from "express";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { storage } from "../storage";
import { type User } from "@shared/schema";
import { geocodeAddress, isGeocodingEnabled } from "../services/geocoding";
import { findExactMatch, findAddressMatch, findPotentialDuplicates } from "../services/duplicate-detection";

const router = Router();

function requireAuth(req: Request, res: Response, next: () => void) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

function isValidNYCZip(zip: string): boolean {
  const zipNum = parseInt(zip, 10);

  if (isNaN(zipNum) || zip.length !== 5) {
    return false;
  }

  // Manhattan
  if (zipNum >= 10001 && zipNum <= 10282) return true;
  // Staten Island
  if (zipNum >= 10301 && zipNum <= 10314) return true;
  // Bronx
  if (zipNum >= 10451 && zipNum <= 10475) return true;
  // Brooklyn
  if (zipNum >= 11201 && zipNum <= 11256) return true;
  // Queens
  if (zipNum >= 11004 && zipNum <= 11697) return true;

  return false;
}

const createBuildingSchema = z.object({
  name: z.string().min(1, "Building name is required").max(255),
  address: z.string().min(1, "Address is required").max(255),
  zip: z.string().length(5, "ZIP code must be 5 digits").refine(isValidNYCZip, {
    message: "Please enter a valid NYC ZIP code",
  }),
  landlord: z.string().max(255).optional(),
  neighborhood: z.string().max(100).optional(),
  buildingType: z.string().max(50).optional(),
});

// Helper function to derive borough from ZIP code
function getBoroughFromZip(zip: string): string | null {
  const zipNum = parseInt(zip, 10);
  if (isNaN(zipNum)) return null;

  // Manhattan
  if (zipNum >= 10001 && zipNum <= 10282) return "Manhattan";
  // Staten Island
  if (zipNum >= 10301 && zipNum <= 10314) return "Staten Island";
  // Bronx
  if (zipNum >= 10451 && zipNum <= 10475) return "Bronx";
  // Brooklyn
  if (zipNum >= 11201 && zipNum <= 11256) return "Brooklyn";
  // Queens
  if (zipNum >= 11004 && zipNum <= 11697) return "Queens";

  return null;
}

// Search suggestions endpoint - returns platform buildings with metadata for autocomplete
router.get("/search-suggestions", async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || "";
    const limit = Math.min(parseInt(req.query.limit as string) || 5, 10);

    // Require at least 2 characters
    if (query.length < 2) {
      return res.json({ data: [] });
    }

    const { buildings } = await storage.searchBuildings(query, 1, limit);

    // Add borough information and format for suggestions
    const suggestions = buildings.map((building) => ({
      id: building.id,
      name: building.name,
      address: building.address,
      borough: getBoroughFromZip(building.zip),
      neighborhood: building.neighborhood,
      averageRating: building.averageRating,
      reviewCount: building.reviewCount,
    }));

    return res.json({ data: suggestions });
  } catch (error) {
    console.error("Search suggestions error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const sort = (req.query.sort as string) || "best";

    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    // Validate sort parameter
    if (!["best", "highest", "most_reviews", "newest", "oldest"].includes(sort)) {
      return res.status(400).json({ message: "Invalid sort parameter" });
    }

    const { buildings, total } = await storage.searchBuildings(search, page, limit, sort);

    return res.json({
      data: buildings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search buildings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const building = await storage.getBuildingWithStats(id);

    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    return res.json({ data: building });
  } catch (error) {
    console.error("Get building error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id/reviews", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sort = (req.query.sort as string) || "newest";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Validate sort parameter
    if (!["newest", "highest", "lowest"].includes(sort)) {
      return res.status(400).json({ message: "Invalid sort parameter" });
    }

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    // Check if building exists
    const building = await storage.getBuilding(id);
    if (!building || building.status !== "approved") {
      return res.status(404).json({ message: "Building not found" });
    }

    // Get current user ID if logged in (for helpful vote status)
    const currentUserId = req.isAuthenticated() ? (req.user as User).id : undefined;

    const { reviews, total } = await storage.getReviewsByBuildingId(
      id,
      sort as "newest" | "highest" | "lowest",
      page,
      limit,
      currentUserId
    );

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
    console.error("Get building reviews error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Toggle helpful vote on a review
router.post("/reviews/:reviewId/helpful", requireAuth, async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const user = req.user as User;

    // Check if user is suspended
    if (user.status === "suspended") {
      return res.status(403).json({ message: "Your account has been suspended" });
    }

    const result = await storage.toggleReviewHelpful(reviewId, user.id);

    return res.json({
      data: {
        isHelpful: result.isHelpful,
        helpfulCount: result.helpfulCount,
      },
    });
  } catch (error) {
    console.error("Toggle helpful vote error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const createReviewSchema = z.object({
  overallRating: z.number().min(1).max(5),
  floorNumber: z.number().min(1).max(200),
  reviewText: z.string().min(1, "Review text is required"),
  noiseRating: z.number().min(0).max(5).optional(),
  cleanlinessRating: z.number().min(0).max(5).optional(),
  maintenanceRating: z.number().min(0).max(5).optional(),
  safetyRating: z.number().min(0).max(5).optional(),
  pestRating: z.number().min(0).max(5).optional(),
  isAnonymous: z.boolean().optional(),
  photos: z.array(z.string()).max(5).optional(),
});

router.post("/:id/reviews", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as User;

    // Check if user is suspended
    if (user.status === "suspended") {
      return res.status(403).json({ message: "Your account has been suspended" });
    }

    // Check if building exists
    const building = await storage.getBuilding(id);
    if (!building || building.status !== "approved") {
      return res.status(404).json({ message: "Building not found" });
    }

    const validatedData = createReviewSchema.parse(req.body);

    const review = await storage.createReview({
      buildingId: id,
      userId: user.id,
      overallRating: validatedData.overallRating,
      floorNumber: validatedData.floorNumber,
      reviewText: validatedData.reviewText,
      noiseRating: validatedData.noiseRating || null,
      cleanlinessRating: validatedData.cleanlinessRating || null,
      maintenanceRating: validatedData.maintenanceRating || null,
      safetyRating: validatedData.safetyRating || null,
      pestRating: validatedData.pestRating || null,
      isAnonymous: validatedData.isAnonymous ?? true,
      status: "approved",
    });

    // Save photos if provided
    if (validatedData.photos && validatedData.photos.length > 0) {
      await storage.addReviewPhotos(review.id, validatedData.photos);
    }

    return res.status(201).json({ data: review });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error("Create review error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/validate-address", async (req: Request, res: Response) => {
  try {
    const { address, zip } = req.body;

    if (!address || !zip) {
      return res.status(400).json({ message: "Address and ZIP are required" });
    }

    let geocodeResult = null;
    let duplicates: { id: string; name: string; address: string; reason: string }[] = [];

    if (isGeocodingEnabled()) {
      geocodeResult = await geocodeAddress(address, "New York", zip);

      if (geocodeResult) {
        const potentialDuplicates = await findPotentialDuplicates(
          geocodeResult.lat,
          geocodeResult.lng,
          address,
          ""
        );

        duplicates = potentialDuplicates.map((d) => ({
          id: d.building.id,
          name: d.building.name,
          address: d.building.address,
          reason: d.reason,
        }));
      }
    } else {
      // Without geocoding, just check address similarity
      const potentialDuplicates = await findPotentialDuplicates(null, null, address, "");
      duplicates = potentialDuplicates.map((d) => ({
        id: d.building.id,
        name: d.building.name,
        address: d.building.address,
        reason: d.reason,
      }));
    }

    return res.json({
      data: {
        valid: geocodeResult !== null || !isGeocodingEnabled(),
        geocode: geocodeResult,
        duplicates,
        geocodingEnabled: isGeocodingEnabled(),
      },
    });
  } catch (error) {
    console.error("Validate address error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as User;

    // Check if user is suspended
    if (user.status === "suspended") {
      return res.status(403).json({ message: "Your account has been suspended" });
    }

    const validatedData = createBuildingSchema.parse(req.body);
    const forceSubmit = req.body.forceSubmit === true;

    // Track matched building for duplicate queue
    let matchedBuildingId: string | null = null;

    // Check for duplicates FIRST, before geocoding
    const exactMatch = await findExactMatch(
      validatedData.address,
      validatedData.name
    );

    if (exactMatch) {
      if (!forceSubmit) {
        return res.status(409).json({
          message: "This building already exists",
          exactMatch: true,
          existingBuilding: {
            id: exactMatch.building.id,
            name: exactMatch.building.name,
            address: exactMatch.building.address,
            neighborhood: exactMatch.building.neighborhood,
            landlord: exactMatch.building.landlord,
            buildingType: exactMatch.building.buildingType,
          },
        });
      }
      matchedBuildingId = exactMatch.building.id;
    }

    // Check for address-only matches (same address, different name)
    if (!matchedBuildingId) {
      const addressMatch = await findAddressMatch(validatedData.address);

      if (addressMatch) {
        if (!forceSubmit) {
          return res.status(409).json({
            message: "A building at this address already exists",
            addressMatch: true,
            existingBuilding: {
              id: addressMatch.building.id,
              name: addressMatch.building.name,
              address: addressMatch.building.address,
              neighborhood: addressMatch.building.neighborhood,
              landlord: addressMatch.building.landlord,
              buildingType: addressMatch.building.buildingType,
            },
          });
        }
        matchedBuildingId = addressMatch.building.id;
      }
    }

    let geocodeResult = null;

    // Try to geocode the address
    if (isGeocodingEnabled()) {
      geocodeResult = await geocodeAddress(
        validatedData.address,
        "New York",
        validatedData.zip
      );

      if (!geocodeResult) {
        return res.status(400).json({
          message: "We couldn't validate this address. Please check and try again.",
        });
      }
    }

    // Create the building
    const building = await storage.createBuilding({
      name: validatedData.name,
      address: validatedData.address,
      city: "New York",
      zip: validatedData.zip,
      landlord: validatedData.landlord || null,
      neighborhood: validatedData.neighborhood || null,
      buildingType: validatedData.buildingType || null,
      geocodeLat: geocodeResult?.lat ?? null,
      geocodeLng: geocodeResult?.lng ?? null,
      status: "approved",
      submittedBy: user.id,
    });

    // If user force-submitted a duplicate, add to duplicate queue for admin review
    if (forceSubmit && matchedBuildingId) {
      await storage.createDuplicateQueueEntry(
        building.id,
        matchedBuildingId,
        100 // High score since it's a known address match
      );
      console.log(`[Duplicate Queue] Added pending duplicate: ${building.id} <-> ${matchedBuildingId}`);
    }

    return res.status(201).json({ data: building });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }

    console.error("Create building error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
