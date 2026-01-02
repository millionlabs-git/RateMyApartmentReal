import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Building2, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { BuildingForm, type BuildingFormValues } from "@/components/buildings/building-form";
import { DuplicateWarning } from "@/components/buildings/duplicate-warning";
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
import { apiRequest } from "@/lib/queryClient";

interface Building {
  id: string;
  name: string;
}

interface DuplicateBuilding {
  id: string;
  name: string;
  address: string;
}

export default function AddBuildingPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [successBuilding, setSuccessBuilding] = useState<Building | null>(null);
  const [duplicates, setDuplicates] = useState<DuplicateBuilding[]>([]);
  const [pendingData, setPendingData] = useState<BuildingFormValues | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: BuildingFormValues & { skipDuplicateCheck?: boolean }) => {
      const res = await apiRequest("POST", "/api/buildings", data);
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 409 && errorData.duplicates) {
          throw { type: "duplicate", duplicates: errorData.duplicates };
        }
        throw new Error(errorData.message || "Failed to submit building");
      }
      return res.json();
    },
    onSuccess: (response) => {
      setDuplicates([]);
      setPendingData(null);
      setSuccessBuilding(response.data);
    },
    onError: (error: any) => {
      if (error.type === "duplicate") {
        setDuplicates(error.duplicates);
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
    setDuplicates([]);
    createMutation.mutate(data);
  };

  const handleProceedWithDuplicate = () => {
    if (pendingData) {
      createMutation.mutate({ ...pendingData, skipDuplicateCheck: true });
    }
  };

  const handleCloseSuccess = () => {
    setSuccessBuilding(null);
    setLocation("/search");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900 py-12 px-4">
        <div className="max-w-xl mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Building2 className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <CardTitle className="font-serif text-2xl">Sign in Required</CardTitle>
            <CardDescription>
              You need to be signed in to add a building.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Link href="/login">
              <Button className="bg-[#B45309] hover:bg-[#92400E] text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">Create Account</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-[#1C1917] dark:text-white mb-2">
            Add a Building
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Can't find your building? Add it to the platform so you and others can review it.
          </p>
        </div>

        {duplicates.length > 0 && (
          <DuplicateWarning
            duplicates={duplicates}
            onProceed={handleProceedWithDuplicate}
            isSubmitting={createMutation.isPending}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Building Details</CardTitle>
            <CardDescription>
              Enter the building information. All buildings are reviewed by our team before being published.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BuildingForm
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!successBuilding} onOpenChange={() => setSuccessBuilding(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Building Submitted!</DialogTitle>
            <DialogDescription className="text-center">
              Your building "{successBuilding?.name}" has been submitted for review.
              Our team will review it shortly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              onClick={handleCloseSuccess}
              className="w-full bg-[#B45309] hover:bg-[#92400E] text-white"
            >
              Browse Buildings
            </Button>
            <Button
              variant="outline"
              onClick={() => setSuccessBuilding(null)}
              className="w-full"
            >
              Add Another Building
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
