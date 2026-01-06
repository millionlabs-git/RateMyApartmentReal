import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PhotoGallery } from "./photo-gallery";

interface Photo {
  id: string;
  imageUrl: string;
}

interface ReviewCardProps {
  overallRating: number;
  floorNumber: number;
  reviewText: string;
  createdAt: string;
  userEmail: string | null;
  isAnonymous: boolean;
  photos?: Photo[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-[#ebba48] text-[#ebba48]"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ReviewCard({
  overallRating,
  floorNumber,
  reviewText,
  createdAt,
  userEmail,
  isAnonymous,
  photos = [],
}: ReviewCardProps) {
  const displayName = isAnonymous || !userEmail ? "Anonymous" : userEmail.split("@")[0];

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="font-medium text-[#1C1917] dark:text-white">
                {displayName}
              </p>
              <p className="text-sm text-gray-500">Floor {floorNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <StarRating rating={overallRating} />
            <p className="text-xs text-gray-500 mt-1">{formatDate(createdAt)}</p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {reviewText}
        </p>
        {photos.length > 0 && <PhotoGallery photos={photos} />}
      </CardContent>
    </Card>
  );
}
