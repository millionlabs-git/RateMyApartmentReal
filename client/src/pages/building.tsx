import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BuildingInfo } from "@/components/buildings/building-info";
import { RatingSummary } from "@/components/buildings/rating-summary";
import { FloorInsights } from "@/components/buildings/floor-insights";
import { CategoryRatingsDisplay } from "@/components/reviews/category-ratings";
import { ReviewList } from "@/components/reviews/review-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryRatings {
  noise: number | null;
  cleanliness: number | null;
  maintenance: number | null;
  safety: number | null;
  pests: number | null;
}

interface FloorInsight {
  floor: number;
  avgRating: number;
  reviewCount: number;
}

interface Building {
  id: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  landlord: string | null;
  neighborhood: string | null;
  buildingType: string | null;
  reviewCount: number;
  averageRating: number | null;
  categoryRatings: CategoryRatings;
  floorInsights: FloorInsight[];
}

export default function BuildingPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery<{ data: Building }>({
    queryKey: ["building", id],
    queryFn: async () => {
      const res = await fetch(`/api/buildings/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Building not found");
        }
        throw new Error("Failed to load building");
      }
      return res.json();
    },
    enabled: !!id,
  });

  const building = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-6 w-32 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !building) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="font-serif text-3xl text-[#1C1917] dark:text-white mb-4">
              Building Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The building you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/search">
              <Button className="bg-[#B45309] hover:bg-[#92400E] text-white">
                Browse Buildings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/search">
          <Button variant="ghost" className="mb-6 -ml-2 text-gray-600 hover:text-[#B45309]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BuildingInfo
              name={building.name}
              address={building.address}
              city={building.city}
              zip={building.zip}
              landlord={building.landlord}
              neighborhood={building.neighborhood}
              buildingType={building.buildingType}
            />
            <CategoryRatingsDisplay
              categoryRatings={building.categoryRatings}
              hasReviews={building.reviewCount > 0}
            />
            <FloorInsights floorInsights={building.floorInsights} />
            <ReviewList
              buildingId={building.id}
              isAuthenticated={isAuthenticated}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <RatingSummary
                averageRating={building.averageRating}
                reviewCount={building.reviewCount}
                buildingId={building.id}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
