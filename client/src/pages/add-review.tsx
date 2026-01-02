import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Building2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ReviewForm, type ReviewFormValues } from "@/components/reviews/review-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Building {
  id: string;
  name: string;
  address: string;
}

export default function AddReviewPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);

  const { data: buildingData, isLoading: buildingLoading } = useQuery<{ data: Building }>({
    queryKey: ["building", id],
    queryFn: async () => {
      const res = await fetch(`/api/buildings/${id}`);
      if (!res.ok) throw new Error("Building not found");
      return res.json();
    },
    enabled: !!id,
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormValues) => {
      const res = await apiRequest("POST", `/api/buildings/${id}/reviews`, data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit review");
      }
      return res.json();
    },
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleSubmit = (data: ReviewFormValues) => {
    createReviewMutation.mutate(data);
  };

  if (authLoading || buildingLoading) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900 py-8 px-4">
        <div className="max-w-xl mx-auto">
          <Skeleton className="h-6 w-32 mb-8" />
          <Skeleton className="h-24 w-full mb-6" />
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
              You need to be signed in to write a review.
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

  const building = buildingData?.data;

  if (!building) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Building Not Found</CardTitle>
            <CardDescription>
              The building you're trying to review doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/search">
              <Button className="bg-[#B45309] hover:bg-[#92400E] text-white">
                Browse Buildings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="font-serif text-2xl">Review Submitted!</CardTitle>
            <CardDescription>
              Thank you for sharing your experience at {building.name}.
              Your review will be visible after moderation.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href={`/building/${id}`}>
              <Button className="w-full bg-[#B45309] hover:bg-[#92400E] text-white">
                View Building
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="w-full">
                Browse More Buildings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <Link href={`/building/${id}`}>
          <Button variant="ghost" className="mb-6 -ml-2 text-gray-600 hover:text-[#B45309]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Building
          </Button>
        </Link>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
              Writing review for
            </p>
            <h1 className="font-serif text-2xl text-[#1C1917] dark:text-white">
              {building.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{building.address}</p>
          </CardContent>
        </Card>

        <ReviewForm
          onSubmit={handleSubmit}
          isSubmitting={createReviewMutation.isPending}
        />
      </div>
    </div>
  );
}
