import { useState } from "react";
import { Link } from "wouter";
import { MessageSquare } from "lucide-react";
import { useReviews, type SortOption } from "@/hooks/use-reviews";
import { ReviewCard } from "./review-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReviewListProps {
  buildingId: string;
  isAuthenticated: boolean;
}

export function ReviewList({ buildingId, isAuthenticated }: ReviewListProps) {
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useReviews(buildingId, sort, page);

  if (isLoading) {
    return (
      <Card liquid>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg font-serif">Reviews</CardTitle>
          <Skeleton className="h-10 w-full sm:w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card liquid>
        <CardContent className="py-8 text-center">
          <p className="text-red-500">Failed to load reviews</p>
        </CardContent>
      </Card>
    );
  }

  const reviews = data?.data ?? [];
  const pagination = data?.pagination;

  if (reviews.length === 0) {
    return (
      <Card liquid>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Reviews</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No reviews yet. Be the first to share your experience!
          </p>
          {isAuthenticated ? (
            <Link href={`/building/${buildingId}/review`}>
              <Button className="bg-[#ebba48] hover:bg-[#C49A3C] text-white">
                Write a Review
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="bg-[#ebba48] hover:bg-[#C49A3C] text-white">
                Sign in to Review
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card liquid>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CardTitle className="text-lg font-serif">
          Reviews ({pagination?.total ?? reviews.length})
        </CardTitle>
        <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            reviewId={review.id}
            buildingId={buildingId}
            overallRating={review.overallRating}
            floorNumber={review.floorNumber}
            reviewText={review.reviewText}
            createdAt={review.createdAt}
            userEmail={review.userEmail}
            isAnonymous={review.isAnonymous}
            photos={review.photos}
            helpfulCount={review.helpfulCount}
            userHasVotedHelpful={review.userHasVotedHelpful}
          />
        ))}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="flex items-center px-3 text-sm text-gray-600">
              Page {page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
