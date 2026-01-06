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
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-3 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] focus-within:ring-2 focus-within:ring-[#ebba48]/50 focus-within:border-[#ebba48]/50 transition-all">
          <Search className="ml-4 h-5 w-5 text-white/60 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by building name or address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 py-3 text-lg text-white placeholder:text-white/50 bg-transparent border-none focus:outline-none"
          />
          <Button
            type="submit"
            className="bg-[#ebba48] hover:bg-[#C49A3C] text-white px-6 py-3 rounded-xl font-medium transition-all flex-shrink-0"
          >
            Search
          </Button>
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
      <Button type="submit" className="bg-[#ebba48] hover:bg-[#C49A3C] text-white">
        Search
      </Button>
    </form>
  );
}
