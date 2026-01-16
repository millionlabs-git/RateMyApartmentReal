import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Building2, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { BuildingForm, type BuildingFormValues } from "@/components/buildings/building-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout/layout";

interface Building {
  id: string;
  name: string;
}

interface ExistingBuilding {
  id: string;
  name: string;
  address: string;
  neighborhood?: string | null;
  landlord?: string | null;
  buildingType?: string | null;
}

export default function AddBuildingPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [successBuilding, setSuccessBuilding] = useState<Building | null>(null);
  const [existingBuilding, setExistingBuilding] = useState<ExistingBuilding | null>(null);
  const [matchType, setMatchType] = useState<"exact" | "address" | null>(null);
  const [pendingData, setPendingData] = useState<BuildingFormValues | null>(null);
  const [formKey, setFormKey] = useState(0);

  const createMutation = useMutation({
    mutationFn: async (data: BuildingFormValues & { forceSubmit?: boolean }) => {
      const res = await fetch("/api/buildings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const responseData = await res.json();
      if (!res.ok) {
        if (res.status === 409 && responseData.exactMatch) {
          throw { type: "exactMatch", existingBuilding: responseData.existingBuilding };
        }
        if (res.status === 409 && responseData.addressMatch) {
          throw { type: "addressMatch", existingBuilding: responseData.existingBuilding };
        }
        throw new Error(responseData.message || "Failed to submit building");
      }
      return responseData;
    },
    onSuccess: (response) => {
      setExistingBuilding(null);
      setMatchType(null);
      setPendingData(null);
      setSuccessBuilding(response.data);
    },
    onError: (error: any) => {
      if (error.type === "exactMatch") {
        setExistingBuilding(error.existingBuilding);
        setMatchType("exact");
      } else if (error.type === "addressMatch") {
        setExistingBuilding(error.existingBuilding);
        setMatchType("address");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to submit building. Please try again.",
        });
      }
    },
  });

  const handleSubmit = (data: BuildingFormValues) => {
    setPendingData(data);
    setExistingBuilding(null);
    setMatchType(null);
    createMutation.mutate(data);
  };

  const handleForceSubmit = () => {
    if (pendingData) {
      setExistingBuilding(null);
      setMatchType(null);
      createMutation.mutate({ ...pendingData, forceSubmit: true });
    }
  };

  const handleCloseMatchDialog = () => {
    setExistingBuilding(null);
    setMatchType(null);
  };

  const handleViewExisting = () => {
    if (existingBuilding) {
      setLocation(`/building/${existingBuilding.id}`);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessBuilding(null);
    setLocation("/search");
  };

  if (isLoading) {
    return (
      <Layout showSkyline>
        <div className="search-page-bg flex-1 flex flex-col -mt-32 pt-40 pb-16 px-4">
          <div className="max-w-3xl mx-auto w-full">
            <Skeleton className="h-12 w-64 mb-3 bg-white/10" />
            <Skeleton className="h-6 w-96 mb-12 bg-white/10" />
            <Skeleton className="h-[500px] w-full rounded-2xl bg-white/10" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout showSkyline>
        <div className="search-page-bg flex-1 flex flex-col -mt-32 pt-40 pb-16 px-4">
          {/* Hero section */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">
              Add a Building
            </h1>
            <p className="text-white/70 text-lg">
              Sign in to contribute to the community
            </p>
          </div>

          {/* Card section */}
          <div className="flex-1 max-w-3xl w-full mx-auto">
            <Card liquid className="w-full max-w-md mx-auto">
              <CardHeader className="text-center pt-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ebba48]/10 dark:bg-[#ebba48]/20">
                  <Building2 className="h-8 w-8 text-[#ebba48]" />
                </div>
                <CardTitle className="font-serif text-xl">Sign in Required</CardTitle>
                <CardDescription>
                  You need to be signed in to add a building.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-4 pb-8">
                <Link href="/login">
                  <Button className="bg-[#ebba48] hover:bg-[#C49A3C] text-white px-6 rounded-xl">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="rounded-xl">Create Account</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSkyline>
      <div className="search-page-bg flex-1 flex flex-col -mt-32 pt-40 pb-16 px-4">
        {/* Hero section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">
            Add a Building
          </h1>
          <p className="text-white/70 text-lg">
            Can't find your building? Add it so you and others can review it.
          </p>
        </div>

        {/* Form section */}
        <div className="flex-1 max-w-3xl w-full mx-auto space-y-6">
          <Card liquid className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">Building Details</CardTitle>
              <CardDescription>
                Enter the building information. All buildings are reviewed by our team before being published.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BuildingForm
                key={formKey}
                onSubmit={handleSubmit}
                isSubmitting={createMutation.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Match Dialog */}
      <Dialog open={!!existingBuilding} onOpenChange={handleCloseMatchDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle className="text-center">
              {matchType === "exact" ? "Building Already Exists" : "Address Already Listed"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {matchType === "exact"
                ? "A building with this exact name and address already exists in our database."
                : "A building at this address already exists in our database with a different name."}
            </DialogDescription>
          </DialogHeader>

          {existingBuilding && (
            <div className="my-4 p-4 rounded-xl bg-stone-100 dark:bg-stone-800/50 space-y-2">
              <p className="font-medium text-stone-900 dark:text-stone-100">
                {existingBuilding.name}
              </p>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {existingBuilding.address}
              </p>
              {existingBuilding.neighborhood && (
                <p className="text-sm text-stone-500 dark:text-stone-500">
                  {existingBuilding.neighborhood}
                </p>
              )}
            </div>
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              onClick={handleViewExisting}
              className="w-full bg-[#ebba48] hover:bg-[#C49A3C] text-white"
            >
              View Existing Building
            </Button>
            <Button
              variant="outline"
              onClick={handleForceSubmit}
              disabled={createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? "Submitting..." : "Submit Anyway (Different Building)"}
            </Button>
            <Button
              variant="ghost"
              onClick={handleCloseMatchDialog}
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={!!successBuilding} onOpenChange={() => setSuccessBuilding(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-center">Building Submitted!</DialogTitle>
            <DialogDescription className="text-center">
              Your building "{successBuilding?.name}" has been submitted for review.
              Our team will review it shortly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col items-center gap-2 sm:flex-col">
            <Button
              onClick={handleCloseSuccess}
              className="w-full bg-[#ebba48] hover:bg-[#C49A3C] text-white"
            >
              Browse Buildings
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSuccessBuilding(null);
                setFormKey(k => k + 1);
              }}
              className="w-full"
            >
              Add Another Building
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
