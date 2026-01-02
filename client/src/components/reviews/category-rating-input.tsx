import { Info } from "lucide-react";
import { RatingInput } from "./rating-input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryRatingInputProps {
  label: string;
  tooltip: string;
  value: number;
  onChange: (value: number) => void;
}

export function CategoryRatingInput({
  label,
  tooltip,
  value,
  onChange,
}: CategoryRatingInputProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#1C1917] dark:text-white">
          {label}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="text-gray-400 hover:text-gray-600">
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <RatingInput value={value} onChange={onChange} size="sm" />
    </div>
  );
}

const categoryInfo = {
  noise: {
    label: "Noise",
    tooltip: "Sound levels from neighbors, street, building systems",
  },
  cleanliness: {
    label: "Cleanliness",
    tooltip: "Common area maintenance, hallways, lobby",
  },
  maintenance: {
    label: "Maintenance",
    tooltip: "Response time and quality of repairs",
  },
  safety: {
    label: "Safety",
    tooltip: "Building security, lighting, entry systems",
  },
  pests: {
    label: "Pests",
    tooltip: "Presence of roaches, mice, bedbugs",
  },
};

type CategoryValues = {
  noise: number;
  cleanliness: number;
  maintenance: number;
  safety: number;
  pests: number;
};

interface CategoryRatingsFormProps {
  values: CategoryValues;
  onChange: (category: keyof CategoryValues, value: number) => void;
}

export function CategoryRatingsForm({ values, onChange }: CategoryRatingsFormProps) {
  return (
    <div className="space-y-1">
      {(Object.keys(categoryInfo) as Array<keyof typeof categoryInfo>).map((key) => (
        <CategoryRatingInput
          key={key}
          label={categoryInfo[key].label}
          tooltip={categoryInfo[key].tooltip}
          value={values[key]}
          onChange={(value) => onChange(key, value)}
        />
      ))}
    </div>
  );
}
