import { Building2, Users, Star, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/layout";

export default function About() {
  return (
    <Layout showSkyline>
      <div className="flex-1 flex flex-col">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4 flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
              About Rate My Apartment
            </h1>
            <p className="text-white/70">
              Helping New Yorkers find their perfect home through honest reviews
            </p>
          </div>
        </div>

        {/* Content section */}
        <div className="flex-1 flex flex-col items-center px-4 -mt-8 pb-12">
          <Card liquid className="w-full max-w-3xl">
            <CardContent className="pt-8 pb-8">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  Our Mission
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  Rate My Apartment was created to bring transparency to the NYC rental market.
                  We believe that renters deserve honest, detailed information about the buildings
                  they're considering before signing a lease. Our platform empowers the community
                  to share their real experiences and help others make informed decisions.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  How It Works
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-[#ebba48]/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-[#ebba48]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1C1917] dark:text-white mb-1">Search Buildings</h3>
                      <p className="text-sm text-[#57534E] dark:text-gray-400">
                        Find any building in NYC by address, neighborhood, or name.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-[#ebba48]/10 flex items-center justify-center">
                      <Star className="h-5 w-5 text-[#ebba48]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1C1917] dark:text-white mb-1">Read Reviews</h3>
                      <p className="text-sm text-[#57534E] dark:text-gray-400">
                        See ratings for noise, cleanliness, maintenance, safety, and more.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-[#ebba48]/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-[#ebba48]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1C1917] dark:text-white mb-1">Share Your Experience</h3>
                      <p className="text-sm text-[#57534E] dark:text-gray-400">
                        Help others by leaving honest reviews of places you've lived.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-[#ebba48]/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-[#ebba48]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1C1917] dark:text-white mb-1">Verified Reviews</h3>
                      <p className="text-sm text-[#57534E] dark:text-gray-400">
                        All reviews are moderated to ensure quality and authenticity.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  Community Guidelines
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-4">
                  We're committed to maintaining a helpful and respectful community. When writing reviews:
                </p>
                <ul className="list-disc list-inside text-[#57534E] dark:text-gray-400 space-y-2 mb-6">
                  <li>Be honest and specific about your experience</li>
                  <li>Focus on facts rather than personal attacks</li>
                  <li>Include details that would help future renters</li>
                  <li>Update your review if conditions change significantly</li>
                </ul>

                <p className="text-[#57534E] dark:text-gray-400">
                  Have questions or feedback? We'd love to hear from you. Reach out through our
                  contact page and our team will get back to you as soon as possible.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
