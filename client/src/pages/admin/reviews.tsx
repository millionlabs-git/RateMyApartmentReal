import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Star, Building2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  buildingId: string;
  buildingName: string;
  userEmail: string;
  overallRating: number;
  reviewText: string;
  floorNumber: number;
  isAnonymous: boolean;
  createdAt: string;
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

export default function AdminReviews() {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery<ReviewsResponse>({
    queryKey: ["admin", "reviews", "pending", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/reviews/pending?page=${page}&limit=10`);
      if (!res.ok) throw new Error("Failed to load reviews");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      reviewId,
      status,
    }: {
      reviewId: string;
      status: "approved" | "denied";
    }) => {
      const res = await fetch(`/api/admin/reviews/${reviewId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update review status");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast({ title: "Review status updated" });
    },
    onError: () => {
      toast({
        title: "Failed to update review status",
        variant: "destructive",
      });
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: async (action: "approve" | "deny") => {
      const res = await fetch("/api/admin/reviews/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action }),
      });
      if (!res.ok) throw new Error("Failed to perform bulk action");
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast({
        title: `${selectedIds.length} reviews ${action === "approve" ? "approved" : "denied"}`,
      });
      setSelectedIds([]);
    },
    onError: () => {
      toast({
        title: "Failed to perform bulk action",
        variant: "destructive",
      });
    },
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (!data) return;
    if (selectedIds.length === data.data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.data.map((r) => r.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-[#B45309] text-[#B45309]"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#1C1917] dark:text-white">
          Review Moderation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Approve or deny pending reviews
        </p>
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
          <span className="font-medium text-blue-800 dark:text-blue-200">
            {selectedIds.length} review(s) selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => bulkActionMutation.mutate("approve")}
              disabled={bulkActionMutation.isPending}
            >
              <Check className="h-4 w-4 mr-1" />
              Approve All
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => bulkActionMutation.mutate("deny")}
              disabled={bulkActionMutation.isPending}
            >
              <X className="h-4 w-4 mr-1" />
              Deny All
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#1C1917] dark:text-white">
              All caught up!
            </h3>
            <p className="text-gray-500 mt-1">
              There are no pending reviews to moderate.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <Checkbox
              checked={data && selectedIds.length === data.data.length}
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-sm text-gray-500">Select all</span>
          </div>

          <div className="space-y-4">
            {data?.data.map((review) => (
              <Card key={review.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedIds.includes(review.id)}
                      onCheckedChange={() => toggleSelect(review.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <CardTitle className="text-base font-medium">
                            {review.buildingName}
                          </CardTitle>
                        </div>
                        {renderStars(review.overallRating)}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>
                          {review.isAnonymous
                            ? "Anonymous"
                            : review.userEmail}
                        </span>
                        <span>Floor {review.floorNumber}</span>
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {review.reviewText}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() =>
                        updateStatusMutation.mutate({
                          reviewId: review.id,
                          status: "approved",
                        })
                      }
                      disabled={updateStatusMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        updateStatusMutation.mutate({
                          reviewId: review.id,
                          status: "denied",
                        })
                      }
                      disabled={updateStatusMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Deny
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Page {page} of {data.pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === data.pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
