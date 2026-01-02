import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface DuplicateBuilding {
  id: string;
  name: string;
  address: string;
}

interface DuplicateWarningProps {
  duplicates: DuplicateBuilding[];
  onProceed: () => void;
  isSubmitting: boolean;
}

export function DuplicateWarning({ duplicates, onProceed, isSubmitting }: DuplicateWarningProps) {
  if (duplicates.length === 0) return null;

  return (
    <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800 dark:text-yellow-200">
        Similar building found
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-yellow-700 dark:text-yellow-300 mb-3">
          A building with a similar address already exists:
        </p>
        <ul className="space-y-2 mb-4">
          {duplicates.map((dup) => (
            <li key={dup.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div>
                <p className="font-medium text-[#1C1917] dark:text-white">{dup.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{dup.address}</p>
              </div>
              <Link href={`/building/${dup.id}`}>
                <Button variant="outline" size="sm">View</Button>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Button
            onClick={onProceed}
            disabled={isSubmitting}
            variant="outline"
            className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
          >
            {isSubmitting ? "Submitting..." : "Add Anyway"}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
