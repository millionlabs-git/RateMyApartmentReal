import { useQuery } from "@tanstack/react-query";

export type SortOption = "newest" | "highest" | "lowest";

interface Photo {
  id: string;
  reviewId: string;
  imageUrl: string;
  createdAt: string;
}

interface Review {
  id: string;
  buildingId: string;
  userId: string;
  overallRating: number;
  floorNumber: number;
  noiseRating: number | null;
  cleanlinessRating: number | null;
  maintenanceRating: number | null;
  safetyRating: number | null;
  pestRating: number | null;
  reviewText: string;
  isAnonymous: boolean;
  status: string;
  createdAt: string;
  userEmail: string | null;
  photos: Photo[];
}

interface ReviewsResponse {
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useReviews(buildingId: string, sort: SortOption = "newest", page: number = 1) {
  return useQuery<ReviewsResponse>({
    queryKey: ["reviews", buildingId, sort, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        sort,
        page: page.toString(),
        limit: "10",
      });
      const res = await fetch(`/api/buildings/${buildingId}/reviews?${params}`);
      if (!res.ok) {
        throw new Error("Failed to load reviews");
      }
      return res.json();
    },
    enabled: !!buildingId,
  });
}
