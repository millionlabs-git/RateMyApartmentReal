import type { Building, Review, ReviewPhoto } from "@shared/schema";

export interface CategoryRatings {
  noise: number | null;
  cleanliness: number | null;
  maintenance: number | null;
  safety: number | null;
  pests: number | null;
}

export interface FloorInsight {
  floor: number;
  avgRating: number;
  reviewCount: number;
}

export interface BuildingWithStats extends Building {
  reviewCount: number;
  averageRating: number | null;
  categoryRatings: CategoryRatings;
  floorInsights: FloorInsight[];
}

export interface AdminStats {
  totalUsers: number;
  totalBuildings: number;
  totalReviews: number;
  pendingBuildings: number;
  pendingReviews: number;
}

export interface ReviewWithDetails extends Review {
  buildingName: string;
  userEmail: string;
  photos: ReviewPhoto[];
}

export interface DuplicatePairWithBuildings {
  id: string;
  building1: Building & { reviewCount: number; averageRating: number | null };
  building2: Building & { reviewCount: number; averageRating: number | null };
  similarityScore: number;
  status: "pending" | "merged" | "dismissed";
  createdAt: Date;
}
