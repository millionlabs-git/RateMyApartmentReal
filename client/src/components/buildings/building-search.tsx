import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BuildingSearchProps {
  initialValue?: string;
  variant?: "default" | "hero";
}

export function BuildingSearch({ initialValue = "", variant = "default" }: BuildingSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [, setLocation] = useLocation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      setLocation("/search");
    }
  };

  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by building name or address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-6 text-lg bg-white/90 backdrop-blur-sm border-white/20 rounded-xl shadow-lg focus:ring-2 focus:ring-[#B45309]"
          />
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search buildings..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-white dark:bg-gray-800 border-[#E7E5E4]"
        />
      </div>
      <Button type="submit" className="bg-[#B45309] hover:bg-[#92400E] text-white">
        Search
      </Button>
    </form>
  );
}
