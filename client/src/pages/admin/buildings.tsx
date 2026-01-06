import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, MapPin, Building2, Pencil, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  status: string;
  reviewCount?: number;
  averageRating?: number | null;
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
  const [tab, setTab] = useState("pending");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    zip: "",
    neighborhood: "",
    landlord: "",
    buildingType: "",
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery<BuildingsResponse>({
    queryKey: ["admin", "buildings", tab, page, search],
    queryFn: async () => {
      const endpoint = tab === "pending"
        ? `/api/admin/buildings/pending?page=${page}&limit=10`
        : `/api/admin/buildings?page=${page}&limit=10&status=${tab}&search=${encodeURIComponent(search)}`;
      const res = await fetch(endpoint);
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

  const updateBuildingMutation = useMutation({
    mutationFn: async (data: { id: string; updates: typeof editForm }) => {
      const res = await fetch(`/api/admin/buildings/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
      });
      if (!res.ok) throw new Error("Failed to update building");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast({ title: "Building updated successfully" });
      setEditingBuilding(null);
    },
    onError: () => {
      toast({
        title: "Failed to update building",
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

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    setEditForm({
      name: building.name,
      address: building.address,
      zip: building.zip,
      neighborhood: building.neighborhood || "",
      landlord: building.landlord || "",
      buildingType: building.buildingType || "",
    });
  };

  const handleSaveEdit = () => {
    if (!editingBuilding) return;
    updateBuildingMutation.mutate({
      id: editingBuilding.id,
      updates: editForm,
    });
  };

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setPage(1);
    setSelectedIds([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Approved</Badge>;
      case "denied":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Denied</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Pending</Badge>;
    }
  };

  const renderBuildingCard = (building: Building, showActions: boolean = true) => (
    <Card key={building.id}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {tab === "pending" && (
            <Checkbox
              checked={selectedIds.includes(building.id)}
              onCheckedChange={() => toggleSelect(building.id)}
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#ebba48]" />
              <CardTitle className="text-lg font-serif">
                {building.name}
              </CardTitle>
              {tab !== "pending" && getStatusBadge(building.status)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              <span>
                {building.address}, {building.city} {building.zip}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {formatDate(building.createdAt)}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleEdit(building)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
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
          {building.reviewCount !== undefined && (
            <Badge variant="outline" className="text-blue-600">
              {building.reviewCount} reviews
            </Badge>
          )}
          {building.averageRating && (
            <Badge variant="outline" className="text-[#ebba48]">
              {building.averageRating.toFixed(1)} rating
            </Badge>
          )}
        </div>
        {showActions && tab === "pending" && (
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
        )}
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#1C1917] dark:text-white">
          Building Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage and moderate building submissions
        </p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="all">All Buildings</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="denied">Denied</TabsTrigger>
        </TabsList>

        {tab !== "pending" && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search buildings..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        )}

        <TabsContent value="pending" className="space-y-4">
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
                {data?.data.map((building) => renderBuildingCard(building))}
              </div>
            </>
          )}
        </TabsContent>

        {["all", "approved", "denied"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            ) : data?.data.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#1C1917] dark:text-white">
                    No buildings found
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {search ? "Try a different search term." : "No buildings match this filter."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data?.data.map((building) => renderBuildingCard(building, false))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Page {page} of {data.pagination.totalPages} ({data.pagination.total} total)
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

      {/* Edit Building Dialog */}
      <Dialog open={!!editingBuilding} onOpenChange={() => setEditingBuilding(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Building</DialogTitle>
            <DialogDescription>
              Update building information. Changes will be reflected immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Building Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={editForm.zip}
                onChange={(e) => setEditForm({ ...editForm, zip: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                value={editForm.neighborhood}
                onChange={(e) => setEditForm({ ...editForm, neighborhood: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landlord">Landlord</Label>
              <Input
                id="landlord"
                value={editForm.landlord}
                onChange={(e) => setEditForm({ ...editForm, landlord: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buildingType">Building Type</Label>
              <Input
                id="buildingType"
                value={editForm.buildingType}
                onChange={(e) => setEditForm({ ...editForm, buildingType: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBuilding(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateBuildingMutation.isPending}
              className="bg-[#ebba48] hover:bg-[#C49A3C] text-white"
            >
              {updateBuildingMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
