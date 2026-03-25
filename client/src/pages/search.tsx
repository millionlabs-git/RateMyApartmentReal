import { useSearch, useLocation } from "wouter";
import { useBuildings } from "@/hooks/use-buildings";
import { SmartSearch } from "@/components/buildings/smart-search";
import { BuildingList } from "@/components/buildings/building-list";
import { Pagination } from "@/components/buildings/pagination";
import { Layout } from "@/components/layout/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchPage() {
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(searchString);
  const query = params.get("q") || "";
  const page = parseInt(params.get("page") || "1");
  const sort = params.get("sort") || "best";

  const { data, isLoading } = useBuildings(query, page, 20, sort);

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams();
    if (query) newParams.set("q", query);
    newParams.set("page", "1");
    if (newSort !== "best") newParams.set("sort", newSort);
    setLocation(`/search?${newParams}`);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams();
    if (query) newParams.set("q", query);
    newParams.set("page", newPage.toString());
    if (sort !== "best") newParams.set("sort", sort);
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
          <SmartSearch
            variant="hero"
            initialValue={query}
            onSearch={(q) => setLocation(`/search?q=${encodeURIComponent(q)}`)}
          />
        </div>

        {/* Results section */}
        <div className="flex-1 max-w-6xl w-full mx-auto">
          {data?.pagination && data.pagination.total > 0 && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-white/50">
                Found <span className="font-medium text-white">{data.pagination.total}</span> {data.pagination.total === 1 ? "building" : "buildings"}
              </p>
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best">Best Match</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="most_reviews">Most Reviews</SelectItem>
                  <SelectItem value="newest">Newest Added</SelectItem>
                  <SelectItem value="oldest">Oldest Added</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
