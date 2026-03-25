import { useState } from "react";
import { Star, User, ThumbsUp } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhotoGallery } from "./photo-gallery";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  imageUrl: string;
}

interface ReviewCardProps {
  reviewId: string;
  buildingId: string;
  overallRating: number;
  floorNumber: number;
  reviewText: string;
  createdAt: string;
  userDisplayName: string | null;
  isAnonymous: boolean;
  photos?: Photo[];
  helpfulCount: number;
  userHasVotedHelpful?: boolean;
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
  reviewId,
  buildingId,
  overallRating,
  floorNumber,
  reviewText,
  createdAt,
  userDisplayName,
  isAnonymous,
  photos = [],
  helpfulCount: initialHelpfulCount,
  userHasVotedHelpful: initialUserHasVoted,
}: ReviewCardProps) {
  // Display logic:
  // - Anonymous review -> "Anonymous Renter"
  // - Non-anonymous + display name -> Show Display Name
  // - Non-anonymous + no display name -> "NYC Renter"
  const displayName = isAnonymous
    ? (userDisplayName || "Anonymous Renter")
    : (userDisplayName || "NYC Renter");
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Local state for optimistic updates
  const [helpfulCount, setHelpfulCount] = useState(initialHelpfulCount);
  const [hasVoted, setHasVoted] = useState(initialUserHasVoted ?? false);

  const helpfulMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/buildings/reviews/${reviewId}/helpful`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update");
      }
      return res.json();
    },
    onMutate: async () => {
      // Optimistic update
      setHasVoted(!hasVoted);
      setHelpfulCount(hasVoted ? helpfulCount - 1 : helpfulCount + 1);
    },
    onError: (error: Error) => {
      // Revert on error
      setHasVoted(hasVoted);
      setHelpfulCount(helpfulCount);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
    onSuccess: (data) => {
      // Sync with server response
      setHasVoted(data.data.isHelpful);
      setHelpfulCount(data.data.helpfulCount);
      // Invalidate to keep cache in sync
      queryClient.invalidateQueries({ queryKey: ["/api/buildings", buildingId, "reviews"] });
    },
  });

  const handleHelpfulClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to mark reviews as helpful.",
      });
      return;
    }
    helpfulMutation.mutate();
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-[#1C1917] dark:text-white truncate">
                {displayName}
              </p>
              <p className="text-sm text-gray-500">Floor {floorNumber}</p>
            </div>
          </div>
          <div className="sm:text-right flex sm:block items-center gap-2 sm:flex-shrink-0">
            <StarRating rating={overallRating} />
            <p className="text-xs text-gray-500 sm:mt-1">{formatDate(createdAt)}</p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words overflow-hidden" style={{ overflowWrap: "anywhere" }}>
          {reviewText}
        </p>
        {photos.length > 0 && <PhotoGallery photos={photos} />}

        {/* Helpful button */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpfulClick}
            disabled={helpfulMutation.isPending}
            className={cn(
              "gap-2 text-sm",
              hasVoted
                ? "text-[#ebba48] hover:text-[#ebba48] hover:bg-[#ebba48]/10"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            <ThumbsUp
              className={cn(
                "w-4 h-4",
                hasVoted && "fill-current"
              )}
            />
            {helpfulCount > 0 ? (
              <span>{helpfulCount} found this helpful</span>
            ) : (
              <span>Helpful</span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
