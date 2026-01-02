interface RatingBarProps {
  label: string;
  rating: number | null;
  maxRating?: number;
}

export function RatingBar({ label, rating, maxRating = 5 }: RatingBarProps) {
  const percentage = rating !== null ? (rating / maxRating) * 100 : 0;
  const displayValue = rating !== null ? rating.toFixed(1) : "-";

  return (
    <div className="flex items-center gap-4">
      <span className="w-28 text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#D97706] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-sm font-medium text-[#1C1917] dark:text-white text-right">
        {displayValue}
      </span>
    </div>
  );
}
