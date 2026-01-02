import { Link } from "wouter";
import { Building2, Plus } from "lucide-react";
import { BuildingCard } from "./building-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Building {
  id: string;
  name: string;
  address: string;
  averageRating: number | null;
  reviewCount: number;
}

interface BuildingListProps {
  buildings: Building[];
  isLoading: boolean;
}

function BuildingCardSkeleton() {
  return (
    <div className="border border-[#E7E5E4] bg-white dark:bg-gray-800 rounded-xl p-6">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function BuildingList({ buildings, isLoading }: BuildingListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <BuildingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (buildings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <Building2 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="font-serif text-xl text-[#1C1917] dark:text-white mb-2">
          No buildings found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Try a different search or add a new building.
        </p>
        <Link href="/add-building">
          <Button className="bg-[#B45309] hover:bg-[#92400E] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Building
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {buildings.map((building) => (
        <BuildingCard
          key={building.id}
          id={building.id}
          name={building.name}
          address={building.address}
          averageRating={building.averageRating}
          reviewCount={building.reviewCount}
        />
      ))}
    </div>
  );
}
