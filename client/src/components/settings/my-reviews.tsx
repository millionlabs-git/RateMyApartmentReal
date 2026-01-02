import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewItem } from "./review-item";
import { type ReviewWithBuilding } from "@shared/schema";

interface ReviewsResponse {
  data: ReviewWithBuilding[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function MyReviews() {
  const { data, isLoading, error } = useQuery<ReviewsResponse>({
    queryKey: ["/api/user/reviews"],
    queryFn: async () => {
      const res = await fetch("/api/user/reviews");
      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load reviews. Please try again.
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <FileText className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You haven't submitted any reviews yet
        </p>
        <Link href="/">
          <Button className="bg-[#B45309] hover:bg-[#92400E] text-white">
            <Search className="mr-2 h-4 w-4" />
            Browse Buildings
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {data.data.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
      {data.pagination.totalPages > 1 && (
        <div className="text-center pt-4 text-sm text-gray-500">
          Showing {data.data.length} of {data.pagination.total} reviews
        </div>
      )}
    </div>
  );
}
