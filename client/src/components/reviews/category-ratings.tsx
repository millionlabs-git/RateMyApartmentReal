import { RatingBar } from "./rating-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryRatings {
  noise: number | null;
  cleanliness: number | null;
  maintenance: number | null;
  safety: number | null;
  pests: number | null;
}

interface CategoryRatingsDisplayProps {
  categoryRatings: CategoryRatings;
  hasReviews: boolean;
}

const categories = [
  { key: "noise" as const, label: "Noise" },
  { key: "cleanliness" as const, label: "Cleanliness" },
  { key: "maintenance" as const, label: "Maintenance" },
  { key: "safety" as const, label: "Safety" },
  { key: "pests" as const, label: "Pests" },
];

export function CategoryRatingsDisplay({
  categoryRatings,
  hasReviews,
}: CategoryRatingsDisplayProps) {
  if (!hasReviews) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Category Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No ratings yet
          </p>
          <div className="space-y-3 opacity-50">
            {categories.map((category) => (
              <RatingBar key={category.key} label={category.label} rating={null} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-serif">Category Ratings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.map((category) => (
            <RatingBar
              key={category.key}
              label={category.label}
              rating={categoryRatings[category.key]}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
