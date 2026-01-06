import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Layout } from "@/components/layout/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout showSkyline>
      <div className="flex-1 flex flex-col">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-5xl md:text-6xl text-white mb-2">
              404
            </h1>
            <p className="text-white/70">
              Page not found
            </p>
          </div>
        </div>

        {/* Card section */}
        <div className="flex-1 flex items-start justify-center px-4 -mt-8 pb-12">
          <Card liquid className="w-full max-w-md">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-3">
                Page Not Found
              </h2>
              <p className="text-[#57534E] dark:text-gray-400 mb-6">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <Link href="/">
                <Button className="bg-[#ebba48] hover:bg-[#C49A3C] text-white px-6 rounded-xl">
                  Go Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
