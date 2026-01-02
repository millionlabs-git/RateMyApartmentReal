import { Star } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RatingSummaryProps {
  averageRating: number | null;
  reviewCount: number;
  buildingId: string;
  isAuthenticated: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 ${
            star <= rating
              ? "fill-[#B45309] text-[#B45309]"
              : star - 0.5 <= rating
              ? "fill-[#B45309]/50 text-[#B45309]"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export function RatingSummary({
  averageRating,
  reviewCount,
  buildingId,
  isAuthenticated,
}: RatingSummaryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {averageRating !== null ? (
            <>
              <div className="flex items-center justify-center gap-3">
                <span className="font-serif text-5xl font-bold text-[#1C1917] dark:text-white">
                  {averageRating.toFixed(1)}
                </span>
                <div className="text-left">
                  <StarRating rating={averageRating} />
                  <p className="text-sm text-gray-500 mt-1">
                    {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="py-4">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No reviews yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Be the first to review this building
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {isAuthenticated ? (
              <Link href={`/building/${buildingId}/review`}>
                <Button className="w-full bg-[#B45309] hover:bg-[#92400E] text-white">
                  Write a Review
                </Button>
              </Link>
            ) : (
              <div className="space-y-2">
                <Link href="/login">
                  <Button className="w-full bg-[#B45309] hover:bg-[#92400E] text-white">
                    Sign in to Review
                  </Button>
                </Link>
                <p className="text-xs text-gray-500">
                  You must be signed in to write a review
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
