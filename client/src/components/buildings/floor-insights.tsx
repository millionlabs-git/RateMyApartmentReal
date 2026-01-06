import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FloorInsight {
  floor: number;
  avgRating: number;
  reviewCount: number;
}

interface FloorInsightsProps {
  floorInsights: FloorInsight[];
}

interface FloorBarProps {
  floor: number;
  avgRating: number;
  reviewCount: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function FloorBar({ floor, avgRating, reviewCount, isHovered, onHover, onLeave }: FloorBarProps) {
  // Height percentage based on rating (1-5 scale)
  const heightPercent = (avgRating / 5) * 100;
  // Opacity based on rating
  const opacity = 0.4 + (avgRating / 5) * 0.6;

  return (
    <div
      className="flex flex-col items-center relative group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Tooltip */}
      <div
        className={`absolute bottom-full mb-2 px-3 py-2 bg-[#1C1917] text-white text-xs rounded-lg whitespace-nowrap z-10 transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <p className="font-medium">Floor {floor}</p>
        <p>{avgRating.toFixed(1)} avg ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})</p>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1C1917]" />
      </div>

      {/* Bar container */}
      <div className="w-10 h-32 bg-gray-100 dark:bg-gray-800 rounded-t-md relative flex items-end overflow-hidden">
        <div
          className="w-full rounded-t-md transition-all duration-300"
          style={{
            height: `${heightPercent}%`,
            backgroundColor: `rgba(235, 186, 72, ${opacity})`,
            transform: isHovered ? "scaleX(1.1)" : "scaleX(1)",
          }}
        />
        {/* Rating label inside bar */}
        {heightPercent > 30 && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-white">
            {avgRating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Floor label */}
      <span className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
        {floor}
      </span>
    </div>
  );
}

export function FloorInsights({ floorInsights }: FloorInsightsProps) {
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);

  if (floorInsights.length === 0) {
    return (
      <Card liquid>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Floor Insights</CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Floor insights will appear after reviews are submitted
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card liquid>
      <CardHeader>
        <CardTitle className="text-lg font-serif">Floor Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Average ratings by floor
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {floorInsights.map((insight) => (
            <FloorBar
              key={insight.floor}
              floor={insight.floor}
              avgRating={insight.avgRating}
              reviewCount={insight.reviewCount}
              isHovered={hoveredFloor === insight.floor}
              onHover={() => setHoveredFloor(insight.floor)}
              onLeave={() => setHoveredFloor(null)}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-3 px-1">
          <span>Lower floors</span>
          <span>Higher floors</span>
        </div>
      </CardContent>
    </Card>
  );
}
