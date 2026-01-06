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
    <div className="glass-card rounded-2xl p-6">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
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
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#ebba48]/10 dark:bg-[#ebba48]/20">
          <Building2 className="h-10 w-10 text-[#ebba48]" />
        </div>
        <h3 className="font-serif text-2xl text-[#1C1917] dark:text-white mb-3">
          No buildings found
        </h3>
        <p className="text-[#57534E] dark:text-gray-400 mb-6 max-w-md mx-auto">
          We couldn't find any buildings matching your search. Try a different query or be the first to add this building.
        </p>
        <Link href="/add-building">
          <Button className="bg-[#ebba48] hover:bg-[#C49A3C] text-white px-6 py-2.5 rounded-xl">
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
