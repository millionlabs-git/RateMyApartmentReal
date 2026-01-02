import { useState } from "react";
import { Star } from "lucide-react";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-8 w-8",
};

export function RatingInput({
  value,
  onChange,
  size = "lg",
  disabled = false,
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          className={`transition-transform ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"
          }`}
          aria-label={`Rate ${star} out of 5`}
        >
          <Star
            className={`${sizeMap[size]} transition-colors ${
              star <= displayValue
                ? "fill-[#D97706] text-[#D97706]"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
