import { Link } from "wouter";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type ReviewWithBuilding } from "@shared/schema";

interface ReviewItemProps {
  review: ReviewWithBuilding;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>;
    case "denied":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Denied</Badge>;
    case "pending":
    default:
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-amber-500 text-amber-500"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
      <div className="flex flex-col gap-1">
        <Link href={`/building/${review.buildingId}`}>
          <span className="font-medium text-[#1C1917] dark:text-white hover:text-[#B45309] cursor-pointer">
            {review.buildingName}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <StarRating rating={review.overallRating} />
          <span className="text-sm text-gray-500">
            {formatDate(review.createdAt)}
          </span>
        </div>
      </div>
      <div>{getStatusBadge(review.status)}</div>
    </div>
  );
}
