import { RatingInput } from "./rating-input";

interface CategoryRatingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function CategoryRatingInput({
  label,
  value,
  onChange,
}: CategoryRatingInputProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <span className="text-sm font-medium text-[#1C1917] dark:text-white">
        {label}
      </span>
      <RatingInput value={value} onChange={onChange} size="sm" />
    </div>
  );
}

const categoryInfo = {
  noise: { label: "Noise" },
  cleanliness: { label: "Cleanliness" },
  maintenance: { label: "Maintenance" },
  safety: { label: "Safety" },
  pests: { label: "Pests" },
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
          value={values[key]}
          onChange={(value) => onChange(key, value)}
        />
      ))}
    </div>
  );
}
