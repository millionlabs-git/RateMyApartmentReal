import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, MapPin, Building2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Building {
  id: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  neighborhood: string | null;
  buildingType: string | null;
  landlord: string | null;
  createdAt: string;
}

interface BuildingsResponse {
  data: Building[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminBuildings() {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery<BuildingsResponse>({
    queryKey: ["admin", "buildings", "pending", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/buildings/pending?page=${page}&limit=10`);
      if (!res.ok) throw new Error("Failed to load buildings");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      buildingId,
      status,
    }: {
      buildingId: string;
      status: "approved" | "denied";
    }) => {
      const res = await fetch(`/api/admin/buildings/${buildingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update building status");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast({ title: "Building status updated" });
    },
    onError: () => {
      toast({
        title: "Failed to update building status",
        variant: "destructive",
      });
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: async (action: "approve" | "deny") => {
      const res = await fetch("/api/admin/buildings/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action }),
      });
      if (!res.ok) throw new Error("Failed to perform bulk action");
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast({
        title: `${selectedIds.length} buildings ${action === "approve" ? "approved" : "denied"}`,
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
      setSelectedIds(data.data.map((b) => b.id));
    }
  };

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
          Building Moderation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Approve or deny pending building submissions
        </p>
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
          <span className="font-medium text-blue-800 dark:text-blue-200">
            {selectedIds.length} building(s) selected
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
            <Skeleton key={i} className="h-40" />
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
              There are no pending buildings to moderate.
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
            {data?.data.map((building) => (
              <Card key={building.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedIds.includes(building.id)}
                      onCheckedChange={() => toggleSelect(building.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-[#B45309]" />
                        <CardTitle className="text-lg font-serif">
                          {building.name}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>
                          {building.address}, {building.city} {building.zip}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatDate(building.createdAt)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {building.neighborhood && (
                      <Badge variant="secondary">{building.neighborhood}</Badge>
                    )}
                    {building.buildingType && (
                      <Badge variant="outline">{building.buildingType}</Badge>
                    )}
                    {building.landlord && (
                      <Badge variant="outline" className="text-gray-500">
                        {building.landlord}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() =>
                        updateStatusMutation.mutate({
                          buildingId: building.id,
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
                          buildingId: building.id,
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
