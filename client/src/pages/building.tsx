import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Building2, User, Map } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { RatingSummary } from "@/components/buildings/rating-summary";
import { FloorInsights } from "@/components/buildings/floor-insights";
import { CategoryRatingsDisplay } from "@/components/reviews/category-ratings";
import { ReviewList } from "@/components/reviews/review-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout/layout";

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
      <Layout showSkyline>
        <div className="search-page-bg flex-1 flex flex-col -mt-32 pt-40 pb-16 px-4">
          <div className="max-w-6xl mx-auto w-full">
            <Skeleton className="h-6 w-24 mb-6 bg-white/10" />
            <Skeleton className="h-12 w-3/4 mb-3 bg-white/10" />
            <Skeleton className="h-6 w-1/2 mb-8 bg-white/10" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48 w-full rounded-2xl bg-white/10" />
                <Skeleton className="h-48 w-full rounded-2xl bg-white/10" />
              </div>
              <div>
                <Skeleton className="h-64 w-full rounded-2xl bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !building) {
    return (
      <Layout showSkyline>
        <div className="search-page-bg flex-1 flex flex-col -mt-32 pt-40 pb-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">
              Building Not Found
            </h1>
            <p className="text-white/70 text-lg mb-8">
              The building you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/search">
              <Button className="bg-[#ebba48] hover:bg-[#C49A3C] text-white rounded-xl px-6">
                Browse Buildings
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSkyline>
      <div className="search-page-bg flex-1 flex flex-col -mt-32 pt-40 pb-16 px-4">
        {/* Back button */}
        <div className="max-w-6xl mx-auto w-full mb-4">
          <Link href="/search">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>

        {/* Hero section with building info */}
        <div className="max-w-6xl mx-auto w-full mb-10">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">
            {building.name}
          </h1>
          <div className="flex items-start gap-2 text-white/70 mb-4">
            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-lg">{building.address}</p>
              <p>{building.city}, NY {building.zip}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {building.neighborhood && (
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                <Map className="h-3 w-3 mr-1" />
                {building.neighborhood}
              </Badge>
            )}
            {building.buildingType && (
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                <Building2 className="h-3 w-3 mr-1" />
                {building.buildingType}
              </Badge>
            )}
            {building.landlord && (
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                <User className="h-3 w-3 mr-1" />
                {building.landlord}
              </Badge>
            )}
          </div>
        </div>

        {/* Main content grid */}
        <div className="flex-1 max-w-6xl w-full mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
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
    </Layout>
  );
}
