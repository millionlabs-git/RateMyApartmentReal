import { useAuth } from "@/hooks/use-auth";
import { MyReviews as MyReviewsComponent } from "@/components/settings/my-reviews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout/layout";

export default function MyReviewsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="py-6 px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout showSkyline>
      {/* Hero section */}
      <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
            My Reviews
          </h1>
          <p className="text-white/70">
            Track and manage all the reviews you've submitted
          </p>
        </div>
      </div>

      {/* Content section */}
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card liquid>
            <CardHeader>
              <CardTitle className="text-xl">Your Submitted Reviews</CardTitle>
              <CardDescription>
                View your reviews and their moderation status (Approved, Pending, or Denied).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MyReviewsComponent />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
