import { useQuery } from "@tanstack/react-query";

interface Building {
  id: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  landlord: string | null;
  neighborhood: string | null;
  buildingType: string | null;
  averageRating: number | null;
  reviewCount: number;
  createdAt: string;
}

interface BuildingsResponse {
  data: Building[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useBuildings(search: string, page: number = 1, limit: number = 20, sort: string = "best") {
  return useQuery<BuildingsResponse>({
    queryKey: ["/api/buildings", { search, page, limit, sort }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      params.set("sort", sort);

      const res = await fetch(`/api/buildings?${params}`);
      if (!res.ok) {
        throw new Error("Failed to fetch buildings");
      }
      return res.json();
    },
  });
}

export function useBuilding(id: string) {
  return useQuery<{ data: Building }>({
    queryKey: ["/api/buildings", id],
    queryFn: async () => {
      const res = await fetch(`/api/buildings/${id}`);
      if (!res.ok) {
        throw new Error("Building not found");
      }
      return res.json();
    },
    enabled: !!id,
  });
}
