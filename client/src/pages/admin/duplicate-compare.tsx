import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import {
  Building2,
  GitMerge,
  X,
  Check,
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface BuildingWithStats {
  id: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  neighborhood: string | null;
  buildingType: string | null;
  landlord: string | null;
  reviewCount: number;
  averageRating: number | null;
  createdAt: string;
}

interface DuplicatePair {
  id: string;
  building1: BuildingWithStats;
  building2: BuildingWithStats;
  similarityScore: number;
  status: string;
  createdAt: string;
}

function ComparisonRow({
  label,
  value1,
  value2,
}: {
  label: string;
  value1: string | number | null;
  value2: string | number | null;
}) {
  const isDifferent = value1 !== value2;
  const displayValue1 = value1 ?? "—";
  const displayValue2 = value2 ?? "—";

  return (
    <div
      className={`grid grid-cols-3 gap-4 py-3 px-4 ${
        isDifferent ? "bg-amber-50 dark:bg-amber-900/20" : ""
      }`}
    >
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div
        className={`text-sm ${
          isDifferent
            ? "text-amber-800 dark:text-amber-200 font-medium"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {displayValue1}
      </div>
      <div
        className={`text-sm ${
          isDifferent
            ? "text-amber-800 dark:text-amber-200 font-medium"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {displayValue2}
      </div>
    </div>
  );
}

export default function DuplicateCompare() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<{ data: DuplicatePair }>({
    queryKey: ["admin", "duplicate", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/duplicates/${id}`);
      if (!res.ok) throw new Error("Failed to load duplicate pair");
      return res.json();
    },
  });

  const dismissMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/duplicates/${id}/dismiss`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to dismiss");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "duplicates"] });
      toast({ title: "Duplicate pair dismissed" });
      setLocation("/admin/duplicates");
    },
    onError: () => {
      toast({ title: "Failed to dismiss", variant: "destructive" });
    },
  });

  const mergeMutation = useMutation({
    mutationFn: async (masterId: string) => {
      const res = await fetch(`/api/admin/duplicates/${id}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterId }),
      });
      if (!res.ok) throw new Error("Failed to merge");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast({ title: "Buildings merged successfully" });
      setShowMergeModal(false);
      setLocation("/admin/duplicates");
    },
    onError: () => {
      toast({ title: "Failed to merge buildings", variant: "destructive" });
    },
  });

  const handleMerge = () => {
    if (selectedMaster) {
      mergeMutation.mutate(selectedMaster);
    }
  };

  const pair = data?.data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-96" />
      </AdminLayout>
    );
  }

  if (error || !pair) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">
            Duplicate pair not found
          </h2>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setLocation("/admin/duplicates")}
          >
            Back to Duplicates
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const reviewsToTransfer =
    selectedMaster === pair.building1.id
      ? pair.building2.reviewCount
      : pair.building1.reviewCount;

  return (
    <AdminLayout>
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => setLocation("/admin/duplicates")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Duplicates
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif text-[#1C1917] dark:text-white">
              Compare Buildings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review the details and decide whether to merge or dismiss
            </p>
          </div>
          <Badge
            className={`text-lg px-4 py-1 ${
              pair.similarityScore >= 80
                ? "bg-red-100 text-red-800"
                : pair.similarityScore >= 60
                ? "bg-amber-100 text-amber-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {pair.similarityScore}% Similar
          </Badge>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="grid grid-cols-3 gap-4">
            <CardTitle className="text-sm font-medium text-gray-500">
              Field
            </CardTitle>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Building A
            </CardTitle>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Building B
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <ComparisonRow
              label="Name"
              value1={pair.building1.name}
              value2={pair.building2.name}
            />
            <ComparisonRow
              label="Address"
              value1={pair.building1.address}
              value2={pair.building2.address}
            />
            <ComparisonRow
              label="City"
              value1={pair.building1.city}
              value2={pair.building2.city}
            />
            <ComparisonRow
              label="ZIP Code"
              value1={pair.building1.zip}
              value2={pair.building2.zip}
            />
            <ComparisonRow
              label="Neighborhood"
              value1={pair.building1.neighborhood}
              value2={pair.building2.neighborhood}
            />
            <ComparisonRow
              label="Building Type"
              value1={pair.building1.buildingType}
              value2={pair.building2.buildingType}
            />
            <ComparisonRow
              label="Landlord"
              value1={pair.building1.landlord}
              value2={pair.building2.landlord}
            />
            <ComparisonRow
              label="Reviews"
              value1={pair.building1.reviewCount}
              value2={pair.building2.reviewCount}
            />
            <ComparisonRow
              label="Avg Rating"
              value1={
                pair.building1.averageRating
                  ? pair.building1.averageRating.toFixed(1)
                  : null
              }
              value2={
                pair.building2.averageRating
                  ? pair.building2.averageRating.toFixed(1)
                  : null
              }
            />
            <ComparisonRow
              label="Created"
              value1={formatDate(pair.building1.createdAt)}
              value2={formatDate(pair.building2.createdAt)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => dismissMutation.mutate()}
          disabled={dismissMutation.isPending}
        >
          <X className="h-4 w-4 mr-2" />
          Not Duplicates (Dismiss)
        </Button>
        <Button
          className="flex-1 bg-[#ebba48] hover:bg-[#C49A3C]"
          onClick={() => {
            // Default to building with more reviews
            const defaultMaster =
              pair.building1.reviewCount >= pair.building2.reviewCount
                ? pair.building1.id
                : pair.building2.id;
            setSelectedMaster(defaultMaster);
            setShowMergeModal(true);
          }}
        >
          <GitMerge className="h-4 w-4 mr-2" />
          Merge Buildings
        </Button>
      </div>

      {/* Merge Modal */}
      <Dialog open={showMergeModal} onOpenChange={setShowMergeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Buildings</DialogTitle>
            <DialogDescription>
              Select the primary building to keep. Reviews from the other
              building will be transferred.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <RadioGroup
              value={selectedMaster || ""}
              onValueChange={setSelectedMaster}
            >
              <div className="space-y-4">
                <div
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer ${
                    selectedMaster === pair.building1.id
                      ? "border-[#ebba48] bg-amber-50 dark:bg-amber-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => setSelectedMaster(pair.building1.id)}
                >
                  <RadioGroupItem
                    value={pair.building1.id}
                    id="building1"
                    className="mt-1"
                  />
                  <Label htmlFor="building1" className="flex-1 cursor-pointer">
                    <div className="font-medium">{pair.building1.name}</div>
                    <div className="text-sm text-gray-500">
                      {pair.building1.address}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {pair.building1.reviewCount} reviews
                      {pair.building1.reviewCount >= pair.building2.reviewCount &&
                        " (Recommended)"}
                    </div>
                  </Label>
                </div>

                <div
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer ${
                    selectedMaster === pair.building2.id
                      ? "border-[#ebba48] bg-amber-50 dark:bg-amber-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => setSelectedMaster(pair.building2.id)}
                >
                  <RadioGroupItem
                    value={pair.building2.id}
                    id="building2"
                    className="mt-1"
                  />
                  <Label htmlFor="building2" className="flex-1 cursor-pointer">
                    <div className="font-medium">{pair.building2.name}</div>
                    <div className="text-sm text-gray-500">
                      {pair.building2.address}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {pair.building2.reviewCount} reviews
                      {pair.building2.reviewCount > pair.building1.reviewCount &&
                        " (Recommended)"}
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Warning:</strong> This will transfer {reviewsToTransfer}{" "}
              review(s) to the selected building and permanently delete the
              other building. This action cannot be undone.
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMergeModal(false)}
              disabled={mergeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#ebba48] hover:bg-[#C49A3C]"
              onClick={handleMerge}
              disabled={!selectedMaster || mergeMutation.isPending}
            >
              {mergeMutation.isPending ? "Merging..." : "Confirm Merge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
