import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MyReviews } from "@/components/settings/my-reviews";
import { Layout } from "@/components/layout/layout";

export default function MyReviewsPage() {
  return (
    <Layout showSkyline>
      {/* Hero section */}
      <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
            My Reviews
          </h1>
          <p className="text-white/70">
            View all the reviews you've submitted
          </p>
        </div>
      </div>

      {/* Content section */}
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card liquid>
            <CardHeader>
              <CardTitle className="text-xl">Your Reviews</CardTitle>
              <CardDescription>
                All reviews you've submitted across buildings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MyReviews />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
