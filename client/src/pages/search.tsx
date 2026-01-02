import { useSearch, useLocation } from "wouter";
import { useBuildings } from "@/hooks/use-buildings";
import { BuildingSearch } from "@/components/buildings/building-search";
import { BuildingList } from "@/components/buildings/building-list";
import { Pagination } from "@/components/buildings/pagination";

export default function SearchPage() {
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(searchString);
  const query = params.get("q") || "";
  const page = parseInt(params.get("page") || "1");

  const { data, isLoading } = useBuildings(query, page);

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams();
    if (query) newParams.set("q", query);
    newParams.set("page", newPage.toString());
    setLocation(`/search?${newParams}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-[#1C1917] dark:text-white mb-4">
            {query ? `Search results for "${query}"` : "Browse Buildings"}
          </h1>
          <BuildingSearch initialValue={query} />
        </div>

        {data?.pagination && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {data.pagination.total} {data.pagination.total === 1 ? "building" : "buildings"} found
          </p>
        )}

        <BuildingList
          buildings={data?.data || []}
          isLoading={isLoading}
        />

        {data?.pagination && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
