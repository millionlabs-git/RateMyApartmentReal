import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Building2, Mail } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { EmailVerificationModal } from "@/components/email-verification-modal";
import { ReviewForm, type ReviewFormValues } from "@/components/reviews/review-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Layout } from "@/components/layout/layout";

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
  const [showVerificationModal, setShowVerificationModal] = useState(false);

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
        const err = new Error(errorData.message || "Failed to submit review");
        (err as any).code = errorData.code;
        throw err;
      }
      return res.json();
    },
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error: any) => {
      if (error.code === "EMAIL_NOT_VERIFIED") {
        setShowVerificationModal(true);
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleSubmit = (data: ReviewFormValues) => {
    if (user && !user.emailVerified) {
      setShowVerificationModal(true);
      return;
    }
    createReviewMutation.mutate(data);
  };

  if (authLoading || buildingLoading) {
    return (
      <Layout showSkyline>
        <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] py-12 px-4">
          <div className="max-w-xl mx-auto">
            <Skeleton className="h-10 w-48 mb-2 bg-white/10" />
            <Skeleton className="h-5 w-72 bg-white/10" />
          </div>
        </div>
        <div className="py-8 px-4">
          <div className="max-w-xl mx-auto">
            <Skeleton className="h-[500px] w-full rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout showSkyline>
        <div className="flex-1 flex flex-col">
          {/* Hero section */}
          <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] py-16 px-4">
            <div className="max-w-md mx-auto text-center">
              <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
                Write a Review
              </h1>
              <p className="text-white/70">
                Sign in to share your experience
              </p>
            </div>
          </div>

          {/* Card section */}
          <div className="flex-1 flex items-start justify-center px-4 -mt-8 pb-12">
            <Card liquid className="w-full max-w-md">
              <CardHeader className="text-center pt-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ebba48]/10 dark:bg-[#ebba48]/20">
                  <Building2 className="h-8 w-8 text-[#ebba48]" />
                </div>
                <CardTitle className="font-serif text-xl">Sign in Required</CardTitle>
                <CardDescription>
                  You need to be signed in to write a review.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-4">
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

  const building = buildingData?.data;

  if (!building) {
    return (
      <Layout showSkyline>
        <div className="flex-1 flex flex-col">
          {/* Hero section */}
          <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] py-16 px-4">
            <div className="max-w-md mx-auto text-center">
              <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
                Building Not Found
              </h1>
              <p className="text-white/70">
                This building doesn't exist
              </p>
            </div>
          </div>

          {/* Card section */}
          <div className="flex-1 flex items-start justify-center px-4 -mt-8 pb-12">
            <Card liquid className="w-full max-w-md text-center">
              <CardContent className="pt-8 pb-8">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ebba48]/10">
                  <Building2 className="h-8 w-8 text-[#ebba48]" />
                </div>
                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-3">
                  Building Not Found
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  The building you're trying to review doesn't exist.
                </p>
                <Link href="/search">
                  <Button className="bg-[#ebba48] hover:bg-[#C49A3C] text-white px-6 rounded-xl">
                    Browse Buildings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout showSkyline>
        <div className="flex-1 flex flex-col">
          {/* Hero section */}
          <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] py-16 px-4">
            <div className="max-w-md mx-auto text-center">
              <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
                Review Submitted!
              </h1>
              <p className="text-white/70">
                Thank you for your contribution
              </p>
            </div>
          </div>

          {/* Card section */}
          <div className="flex-1 flex items-start justify-center px-4 -mt-8 pb-12">
            <Card liquid className="w-full max-w-md text-center">
              <CardContent className="pt-8 pb-8">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                  <Building2 className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-3">
                  Review Submitted!
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  Thank you for sharing your experience at {building.name}. Your review will be visible after moderation.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href={`/building/${id}`}>
                    <Button className="w-full bg-[#ebba48] hover:bg-[#C49A3C] text-white rounded-xl">
                      View Building
                    </Button>
                  </Link>
                  <Link href="/search">
                    <Button variant="outline" className="w-full rounded-xl">
                      Browse More Buildings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSkyline>
      {/* Hero section */}
      <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] py-12 px-4">
        <div className="max-w-xl mx-auto">
          <Link href={`/building/${id}`}>
            <Button variant="ghost" className="mb-4 -ml-2 text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Building
            </Button>
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
            Write a Review
          </h1>
          <p className="text-white/70">
            Share your experience at {building.name}
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="py-8 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          {user && !user.emailVerified && (
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4">
              <Mail className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Please verify your email address before submitting a review. Check your inbox for a verification link.
              </p>
            </div>
          )}

          <Card liquid>
            <CardContent className="pt-6">
              <p className="text-sm text-[#57534E] dark:text-gray-400 uppercase tracking-wide mb-1">
                Reviewing
              </p>
              <h2 className="font-serif text-xl text-[#1C1917] dark:text-white">
                {building.name}
              </h2>
              <p className="text-[#57534E] dark:text-gray-400">{building.address}</p>
            </CardContent>
          </Card>

          <ReviewForm
            onSubmit={handleSubmit}
            isSubmitting={createReviewMutation.isPending}
          />
        </div>
      </div>

      <EmailVerificationModal
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
      />
    </Layout>
  );
}
