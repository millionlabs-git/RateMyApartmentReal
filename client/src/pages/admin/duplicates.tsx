import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, GitMerge, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface BuildingWithStats {
  id: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  neighborhood: string | null;
  buildingType: string | null;
  reviewCount: number;
  averageRating: number | null;
}

interface DuplicatePair {
  id: string;
  building1: BuildingWithStats;
  building2: BuildingWithStats;
  similarityScore: number;
  status: string;
  createdAt: string;
}

interface DuplicatesResponse {
  data: DuplicatePair[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function getSimilarityColor(score: number): string {
  if (score >= 80) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  if (score >= 60) return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
}

export default function AdminDuplicates() {
  const [page, setPage] = useState(1);
  const [, setLocation] = useLocation();

  const { data, isLoading } = useQuery<DuplicatesResponse>({
    queryKey: ["admin", "duplicates", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/duplicates?page=${page}&limit=10`);
      if (!res.ok) throw new Error("Failed to load duplicates");
      return res.json();
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#1C1917] dark:text-white">
          Duplicate Buildings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and merge potential duplicate building entries
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GitMerge className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#1C1917] dark:text-white">
              No duplicates detected
            </h3>
            <p className="text-gray-500 mt-1">
              There are no potential duplicate buildings to review.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {data?.data.map((pair) => (
              <Card key={pair.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitMerge className="h-5 w-5 text-[#ebba48]" />
                      <CardTitle className="text-base font-medium">
                        Potential Duplicate Detected
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getSimilarityColor(pair.similarityScore)}>
                        {pair.similarityScore}% Similar
                      </Badge>
                      <span className="text-sm text-gray-400">
                        {formatDate(pair.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Building 1 */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-[#1C1917] dark:text-white">
                          {pair.building1.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {pair.building1.address}
                      </p>
                      <div className="flex gap-2 text-xs">
                        <span className="text-gray-400">
                          {pair.building1.reviewCount} reviews
                        </span>
                        {pair.building1.averageRating && (
                          <span className="text-amber-600">
                            {pair.building1.averageRating.toFixed(1)} avg
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Building 2 */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-[#1C1917] dark:text-white">
                          {pair.building2.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {pair.building2.address}
                      </p>
                      <div className="flex gap-2 text-xs">
                        <span className="text-gray-400">
                          {pair.building2.reviewCount} reviews
                        </span>
                        {pair.building2.averageRating && (
                          <span className="text-amber-600">
                            {pair.building2.averageRating.toFixed(1)} avg
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setLocation(`/admin/duplicates/${pair.id}`)}
                    className="w-full"
                  >
                    Review & Compare
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
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
