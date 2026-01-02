import { Link } from "wouter";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BuildingCardProps {
  id: string;
  name: string;
  address: string;
  averageRating: number | null;
  reviewCount: number;
}

function StarRating({ rating }: { rating: number | null }) {
  const displayRating = rating ?? 0;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(displayRating)
              ? "fill-amber-500 text-amber-500"
              : "text-gray-300"
          }`}
        />
      ))}
      {rating !== null && (
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

export function BuildingCard({ id, name, address, averageRating, reviewCount }: BuildingCardProps) {
  return (
    <Link href={`/building/${id}`}>
      <Card className="cursor-pointer border border-[#E7E5E4] bg-white dark:bg-gray-800 rounded-xl transition-shadow hover:shadow-lg">
        <CardContent className="p-6">
          <h3 className="font-serif text-lg font-medium text-[#1C1917] dark:text-white mb-2 line-clamp-1">
            {name}
          </h3>
          <div className="flex items-start gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{address}</span>
          </div>
          <div className="flex items-center justify-between">
            <StarRating rating={averageRating} />
            <span className="text-sm text-gray-500">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
