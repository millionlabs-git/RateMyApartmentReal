import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Forbidden() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-serif text-[#1C1917] dark:text-white mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          You don't have permission to access this page. This area is restricted
          to administrators only.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
          >
            Go Home
          </Button>
          <Button
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
