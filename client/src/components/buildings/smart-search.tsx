import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, Building2, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuildingSuggestion {
  id: string;
  name: string;
  address: string;
  borough: string | null;
  neighborhood: string | null;
  averageRating: number | null;
  reviewCount: number;
}

interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface SmartSearchProps {
  variant?: "hero" | "default";
  placeholder?: string;
  className?: string;
  initialValue?: string;
  onSearch?: (query: string) => void;
}

export function SmartSearch({
  variant = "default",
  placeholder = "Search by building name or address...",
  className,
  initialValue = "",
  onSearch,
}: SmartSearchProps) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState(initialValue);
  const [buildings, setBuildings] = useState<BuildingSuggestion[]>([]);
  const [places, setPlaces] = useState<PlacePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const totalItems = buildings.length + (places.length > 0 ? places.length + 1 : 0); // +1 for section header

  const fetchBuildings = useCallback(async (search: string) => {
    if (search.length < 2) {
      setBuildings([]);
      return;
    }

    setIsLoadingBuildings(true);
    try {
      const res = await fetch(`/api/buildings/search-suggestions?q=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setBuildings(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch building suggestions:", error);
    } finally {
      setIsLoadingBuildings(false);
    }
  }, []);

  const fetchPlaces = useCallback(async (search: string) => {
    if (search.length < 3) {
      setPlaces([]);
      return;
    }

    setIsLoadingPlaces(true);
    try {
      const res = await fetch(`/api/places/autocomplete?query=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setPlaces(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch place suggestions:", error);
    } finally {
      setIsLoadingPlaces(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setHighlightedIndex(-1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchBuildings(newValue);
      fetchPlaces(newValue);
    }, 300);

    if (newValue.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleBuildingSelect = (building: BuildingSuggestion) => {
    setIsOpen(false);
    setQuery("");
    setBuildings([]);
    setPlaces([]);
    setLocation(`/building/${building.id}`);
  };

  const handlePlaceSelect = async (place: PlacePrediction) => {
    setIsOpen(false);

    // Navigate to search results with the address
    if (onSearch) {
      onSearch(place.mainText);
    } else {
      setLocation(`/search?q=${encodeURIComponent(place.mainText)}`);
    }

    setQuery("");
    setBuildings([]);
    setPlaces([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onSearch) {
        onSearch(query.trim());
      } else {
        setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
      return;
    }

    const buildingsCount = buildings.length;
    const hasPlaces = places.length > 0;
    const placesStartIndex = buildingsCount + (hasPlaces ? 1 : 0); // +1 for section header

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev + 1;
          // Skip the section header
          if (hasPlaces && next === buildingsCount) {
            next = buildingsCount + 1;
          }
          return next < totalItems ? next : prev;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev - 1;
          // Skip the section header
          if (hasPlaces && next === buildingsCount) {
            next = buildingsCount - 1;
          }
          return next >= 0 ? next : -1;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (highlightedIndex < buildingsCount) {
            handleBuildingSelect(buildings[highlightedIndex]);
          } else if (highlightedIndex > buildingsCount) {
            const placeIndex = highlightedIndex - placesStartIndex;
            if (placeIndex >= 0 && placeIndex < places.length) {
              handlePlaceSelect(places[placeIndex]);
            }
          }
        } else if (query.trim()) {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Update when initialValue changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const isLoading = isLoadingBuildings || isLoadingPlaces;
  const hasResults = buildings.length > 0 || places.length > 0;

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => hasResults && query.length >= 2 && setIsOpen(true)}
            placeholder={placeholder}
            autoComplete="off"
            className={cn(
              "w-full transition-all",
              isHero
                ? "h-14 pl-12 pr-4 text-lg rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[#ebba48] focus:ring-2 focus:ring-[#ebba48]/20"
                : "h-12 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ebba48]/50 focus:border-[#ebba48]"
            )}
          />
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2",
            isHero ? "left-4" : "left-3"
          )}>
            {isLoading ? (
              <Loader2 className={cn(
                "animate-spin",
                isHero ? "w-5 h-5 text-white/50" : "w-4 h-4 text-gray-400"
              )} />
            ) : (
              <Search className={cn(
                isHero ? "w-5 h-5 text-white/50" : "w-4 h-4 text-gray-400"
              )} />
            )}
          </div>
        </div>
      </form>

      {isOpen && hasResults && (
        <div className={cn(
          "absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-[400px] overflow-auto",
          isHero && "bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg"
        )}>
          {/* Platform Buildings Section */}
          {buildings.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-[#ebba48] uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                Buildings with Reviews
              </div>
              {buildings.map((building, index) => (
                <button
                  key={building.id}
                  type="button"
                  onClick={() => handleBuildingSelect(building)}
                  className={cn(
                    "w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                    index === highlightedIndex && "bg-gray-50 dark:bg-gray-700/50",
                    index !== buildings.length - 1 && "border-b border-gray-100 dark:border-gray-700/50"
                  )}
                >
                  <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-[#ebba48]/10 flex items-center justify-center mt-0.5">
                    <Building2 className="w-4 h-4 text-[#ebba48]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {building.name}
                      </span>
                      {building.averageRating !== null && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-3.5 h-3.5 text-[#ebba48] fill-[#ebba48]" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {building.averageRating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({building.reviewCount})
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {building.address}
                      {building.borough && ` · ${building.borough}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Google Places Section */}
          {places.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                Search New Address
              </div>
              {places.map((place, index) => {
                const actualIndex = buildings.length + 1 + index; // +1 for section header
                return (
                  <button
                    key={place.placeId}
                    type="button"
                    onClick={() => handlePlaceSelect(place)}
                    className={cn(
                      "w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                      actualIndex === highlightedIndex && "bg-gray-50 dark:bg-gray-700/50",
                      index !== places.length - 1 && "border-b border-gray-100 dark:border-gray-700/50"
                    )}
                  >
                    <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mt-0.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {place.mainText}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {place.secondaryText}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
