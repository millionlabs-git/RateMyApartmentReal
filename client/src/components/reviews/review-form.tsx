import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { RatingInput } from "./rating-input";
import { CategoryRatingsForm } from "./category-rating-input";
import { PhotoUpload } from "./photo-upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const reviewSchema = z.object({
  overallRating: z.number().min(1, "Please select an overall rating").max(5),
  floorNumber: z.number().min(1, "Please select a floor").max(200),
  reviewText: z.string().min(1, "Please write a review"),
  noiseRating: z.number().min(0).max(5),
  cleanlinessRating: z.number().min(0).max(5),
  maintenanceRating: z.number().min(0).max(5),
  safetyRating: z.number().min(0).max(5),
  pestRating: z.number().min(0).max(5),
  isAnonymous: z.boolean(),
  photos: z.array(z.string()).max(5).optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onSubmit: (data: ReviewFormValues) => void;
  isSubmitting: boolean;
}

export function ReviewForm({ onSubmit, isSubmitting }: ReviewFormProps) {
  const [categoryRatings, setCategoryRatings] = useState({
    noise: 0,
    cleanliness: 0,
    maintenance: 0,
    safety: 0,
    pests: 0,
  });
  const [photos, setPhotos] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      overallRating: 0,
      floorNumber: 0,
      reviewText: "",
      noiseRating: 0,
      cleanlinessRating: 0,
      maintenanceRating: 0,
      safetyRating: 0,
      pestRating: 0,
      isAnonymous: true,
    },
  });

  const reviewText = watch("reviewText");
  const charCount = reviewText?.length || 0;
  const showCharWarning = charCount > 0 && charCount < 50;

  const handleFormSubmit = (data: ReviewFormValues) => {
    onSubmit({
      ...data,
      noiseRating: categoryRatings.noise,
      cleanlinessRating: categoryRatings.cleanliness,
      maintenanceRating: categoryRatings.maintenance,
      safetyRating: categoryRatings.safety,
      pestRating: categoryRatings.pests,
      photos,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Overall Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Overall Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="overallRating"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col items-center gap-2">
                <RatingInput
                  value={field.value}
                  onChange={field.onChange}
                  size="lg"
                />
                {field.value > 0 && (
                  <span className="text-sm text-gray-500">
                    {field.value} out of 5 stars
                  </span>
                )}
              </div>
            )}
          />
          {errors.overallRating && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.overallRating.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Floor Number */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Floor Number</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="floor" className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
            Which floor did you live on?
          </Label>
          <Controller
            name="floorNumber"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ? field.value.toString() : ""}
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((floor) => (
                    <SelectItem key={floor} value={floor.toString()}>
                      Floor {floor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.floorNumber && (
            <p className="text-red-500 text-sm mt-2">{errors.floorNumber.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Category Ratings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Category Ratings</CardTitle>
          <p className="text-sm text-gray-500">Optional but recommended</p>
        </CardHeader>
        <CardContent>
          <CategoryRatingsForm
            values={categoryRatings}
            onChange={(category, value) =>
              setCategoryRatings((prev) => ({ ...prev, [category]: value }))
            }
          />
        </CardContent>
      </Card>

      {/* Review Text */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Your Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="reviewText"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Textarea
                  {...field}
                  placeholder="Share your experience living in this building. What did you like? What could be improved?"
                  className="min-h-[150px] resize-y"
                />
                <div className="flex justify-between items-center">
                  <div>
                    {showCharWarning && (
                      <p className="text-amber-600 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        We recommend at least 50 characters for a helpful review
                      </p>
                    )}
                    {errors.reviewText && (
                      <p className="text-red-500 text-sm">{errors.reviewText.message}</p>
                    )}
                  </div>
                  <span className={`text-sm ${charCount < 50 ? "text-gray-400" : "text-green-600"}`}>
                    {charCount} characters
                  </span>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Photos</CardTitle>
          <p className="text-sm text-gray-500">Optional - Add up to 5 photos</p>
        </CardHeader>
        <CardContent>
          <PhotoUpload photos={photos} onChange={setPhotos} />
        </CardContent>
      </Card>

      {/* Anonymous Toggle */}
      <Card>
        <CardContent className="pt-6">
          <Controller
            name="isAnonymous"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="anonymous" className="text-sm font-medium">
                    Post Anonymously
                  </Label>
                  <p className="text-sm text-gray-500">
                    Your email won't be visible to other users
                  </p>
                </div>
                <Switch
                  id="anonymous"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#B45309] hover:bg-[#92400E] text-white py-6 text-lg"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
