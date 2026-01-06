import { useSearch, useLocation } from "wouter";
import { useBuildings } from "@/hooks/use-buildings";
import { BuildingSearch } from "@/components/buildings/building-search";
import { BuildingList } from "@/components/buildings/building-list";
import { Pagination } from "@/components/buildings/pagination";
import { Layout } from "@/components/layout/layout";

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
    <Layout showSkyline>
      {/* Full page sky container - light blue day, dark night */}
      <div className="search-page-bg flex-1 flex flex-col -mt-32 pt-40 pb-16 px-4">
        {/* Hero section with search */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">
            {query ? "Search Results" : "Find Your Building"}
          </h1>
          <p className="text-white/70 text-lg mb-8">
            {query
              ? `Showing results for "${query}"`
              : "Search thousands of NYC apartments and read honest reviews"
            }
          </p>
          <BuildingSearch initialValue={query} variant="hero" />
        </div>

        {/* Results section */}
        <div className="flex-1 max-w-6xl w-full mx-auto">
          {data?.pagination && data.pagination.total > 0 && (
            <p className="text-sm text-white/50 mb-6">
              Found <span className="font-medium text-white">{data.pagination.total}</span> {data.pagination.total === 1 ? "building" : "buildings"}
            </p>
          )}

          <BuildingList
            buildings={data?.data || []}
            isLoading={isLoading}
          />

          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                page={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
