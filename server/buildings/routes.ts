import { Router, Request, Response } from "express";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { storage } from "../storage";
import { type User } from "@shared/schema";
import { geocodeAddress, isGeocodingEnabled } from "../services/geocoding";
import { findPotentialDuplicates } from "../services/duplicate-detection";

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

router.get("/", async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    const { buildings, total } = await storage.searchBuildings(search, page, limit);

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

    const { reviews, total } = await storage.getReviewsByBuildingId(
      id,
      sort as "newest" | "highest" | "lowest",
      page,
      limit
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
});

router.post("/:id/reviews", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as User;

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
      status: "pending",
    });

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
    const validatedData = createBuildingSchema.parse(req.body);
    const skipDuplicateCheck = req.body.skipDuplicateCheck === true;

    let geocodeResult = null;
    let duplicates: { id: string; name: string; address: string }[] = [];

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

    // Check for duplicates unless explicitly skipped
    if (!skipDuplicateCheck) {
      const potentialDuplicates = await findPotentialDuplicates(
        geocodeResult?.lat ?? null,
        geocodeResult?.lng ?? null,
        validatedData.address,
        validatedData.name
      );

      if (potentialDuplicates.length > 0) {
        return res.status(409).json({
          message: "A similar building may already exist",
          duplicates: potentialDuplicates.map((d) => ({
            id: d.building.id,
            name: d.building.name,
            address: d.building.address,
          })),
        });
      }
    }

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
      status: "pending",
    });

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
