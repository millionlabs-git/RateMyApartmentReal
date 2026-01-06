import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/layout";

export default function Forbidden() {
  const [, setLocation] = useLocation();

  return (
    <Layout showSkyline>
      <div className="flex-1 flex flex-col">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-5xl md:text-6xl text-white mb-2">
              403
            </h1>
            <p className="text-white/70">
              Access denied
            </p>
          </div>
        </div>

        {/* Card section */}
        <div className="flex-1 flex items-start justify-center px-4 -mt-8 pb-12">
          <Card liquid className="w-full max-w-md">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                <ShieldX className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-3">
                Access Denied
              </h2>
              <p className="text-[#57534E] dark:text-gray-400 mb-6">
                You don't have permission to access this page. This area is restricted to administrators only.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="rounded-xl"
                >
                  Go Home
                </Button>
                <Button
                  onClick={() => window.history.back()}
                  className="bg-[#ebba48] hover:bg-[#C49A3C] text-white rounded-xl"
                >
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
