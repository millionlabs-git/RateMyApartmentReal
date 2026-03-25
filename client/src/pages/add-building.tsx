import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Building2, CheckCircle, AlertTriangle, Mail } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { BuildingForm, type BuildingFormValues } from "@/components/buildings/building-form";
import { ReviewForm, type ReviewFormValues } from "@/components/reviews/review-form";
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
import { apiRequest } from "@/lib/queryClient";

interface Building {
  id: string;
  name: string;
  address: string;
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
  const [step, setStep] = useState<1 | 2>(1);
  const [createdBuilding, setCreatedBuilding] = useState<Building | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
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
        throw new Error(responseData.message || "Failed to submit residence");
      }
      return responseData;
    },
    onSuccess: (response) => {
      setExistingBuilding(null);
      setMatchType(null);
      setPendingData(null);
      setCreatedBuilding(response.data);
      setStep(2);
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
          description: error.message || "Failed to submit residence. Please try again.",
        });
      }
    },
  });

  const handleSubmit = (data: BuildingFormValues) => {
    // Clean up borough (not stored in DB) and "not_sure" neighborhood
    const { borough, ...submitData } = data;
    if (submitData.neighborhood === "not_sure") {
      submitData.neighborhood = "";
    }
    setPendingData(data);
    setExistingBuilding(null);
    setMatchType(null);
    createMutation.mutate(submitData);
  };

  const handleForceSubmit = () => {
    if (pendingData) {
      const { borough, ...submitData } = pendingData;
      if (submitData.neighborhood === "not_sure") {
        submitData.neighborhood = "";
      }
      setExistingBuilding(null);
      setMatchType(null);
      createMutation.mutate({ ...submitData, forceSubmit: true });
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

  const createReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormValues) => {
      const res = await apiRequest("POST", `/api/buildings/${createdBuilding!.id}/reviews`, data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit review");
      }
      return res.json();
    },
    onSuccess: () => {
      setReviewSubmitted(true);
      setSuccessBuilding(createdBuilding);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleReset = () => {
    setStep(1);
    setCreatedBuilding(null);
    setSuccessBuilding(null);
    setReviewSubmitted(false);
    setFormKey(k => k + 1);
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
              Can't find your building?
            </h1>
            <p className="text-white/70 text-lg">
              To protect renters and prevent abuse, adding buildings requires an account.
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
                  You need to be signed in to add a residence.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 pb-8">
                <div className="flex justify-center gap-4">
                  <Link href="/login">
                    <Button className="bg-[#ebba48] hover:bg-[#C49A3C] text-white px-6 rounded-xl">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline" className="rounded-xl">Create Account</Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your name and email are never shown publicly.
                </p>
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
            {step === 1 ? "Add a Residence" : "Write a Review"}
          </h1>
          <p className="text-white/70 text-lg">
            {step === 1
              ? "Can't find your residence? Add it so you and others can review it."
              : `Share your experience at ${createdBuilding?.name || createdBuilding?.address}`
            }
          </p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-[#ebba48]' : 'bg-white/20'}`} />
            <div className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-[#ebba48]' : 'bg-white/20'}`} />
          </div>
        </div>

        {/* Step 1: Building Form */}
        {step === 1 && (
          <div className="flex-1 max-w-3xl w-full mx-auto space-y-6">
            {user && !user.emailVerified && (
              <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-4">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Don't forget to verify your email! Check your inbox for a verification link.
                </p>
              </div>
            )}

            <Card liquid className="w-full">
              <CardHeader>
                <CardTitle className="text-xl">Residence Details</CardTitle>
                <CardDescription>
                  Step 1 of 2 — Enter the residence information.
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
        )}

        {/* Step 2: Review Form */}
        {step === 2 && createdBuilding && (
          <div className="flex-1 max-w-3xl w-full mx-auto space-y-6">
            {/* Building info card */}
            <Card liquid>
              <CardContent className="pt-6">
                <p className="text-sm text-[#57534E] dark:text-gray-400 uppercase tracking-wide mb-1">
                  Reviewing
                </p>
                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white">
                  {createdBuilding.name || createdBuilding.address}
                </h2>
                <p className="text-[#57534E] dark:text-gray-400">{createdBuilding.address}</p>
              </CardContent>
            </Card>

            <ReviewForm
              onSubmit={(data) => createReviewMutation.mutate(data)}
              isSubmitting={createReviewMutation.isPending}
            />

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setSuccessBuilding(createdBuilding);
                }}
                className="text-white/60 hover:text-white"
              >
                Skip review for now
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Match Dialog */}
      <Dialog open={!!existingBuilding} onOpenChange={handleCloseMatchDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle className="text-center">
              {matchType === "exact" ? "Residence Already Exists" : "Address Already Listed"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {matchType === "exact"
                ? "A residence with this exact name and address already exists in our database."
                : "A residence at this address already exists in our database with a different name."}
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
              View Existing Residence
            </Button>
            <Button
              variant="outline"
              onClick={handleForceSubmit}
              disabled={createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? "Submitting..." : "Submit Anyway (Different Residence)"}
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
            <DialogTitle className="text-center">All Done!</DialogTitle>
            <DialogDescription className="text-center">
              {reviewSubmitted
                ? "Your residence and review are now live!"
                : "Your residence has been added! You can write a review anytime."
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col w-full gap-2 sm:flex-col sm:space-x-0">
            <Button
              onClick={() => {
                setSuccessBuilding(null);
                setLocation(`/building/${successBuilding?.id}`);
              }}
              className="w-full bg-[#ebba48] hover:bg-[#C49A3C] text-white"
            >
              View Residence
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full"
            >
              Add Another Residence
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </Layout>
  );
}
