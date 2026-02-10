import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isValidNYCZip, NYC_BOROUGHS, BOROUGH_NEIGHBORHOODS, NYC_NEIGHBORHOODS, BUILDING_TYPES } from "@/lib/validation";
import type { NYCBorough } from "@/lib/validation";

const buildingFormSchema = z.object({
  name: z.string().max(255),
  address: z.string().min(1, "Address is required").max(255),
  zip: z.string().length(5, "ZIP code must be 5 digits").refine(isValidNYCZip, {
    message: "Please enter a valid NYC ZIP code",
  }),
  landlord: z.string().max(255).optional(),
  borough: z.string().optional(),
  neighborhood: z.string().max(100).optional(),
  buildingType: z.string().max(50).optional(),
});

export type BuildingFormValues = z.infer<typeof buildingFormSchema>;

interface BuildingFormProps {
  onSubmit: (data: BuildingFormValues) => void;
  isSubmitting: boolean;
}

export function BuildingForm({ onSubmit, isSubmitting }: BuildingFormProps) {
  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingFormSchema),
    defaultValues: {
      name: "",
      address: "",
      zip: "",
      landlord: "",
      borough: "",
      neighborhood: "",
      buildingType: "",
    },
  });

  const selectedBorough = form.watch("borough");

  const neighborhoodOptions = selectedBorough && selectedBorough in BOROUGH_NEIGHBORHOODS
    ? BOROUGH_NEIGHBORHOODS[selectedBorough as NYCBorough].sort()
    : [];

  const handleBoroughChange = (value: string, fieldOnChange: (value: string) => void) => {
    fieldOnChange(value);
    // Reset neighborhood when borough changes
    form.setValue("neighborhood", "");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Residence Name (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., The Belnord, Sunset Towers"
                  className="bg-white dark:bg-gray-800 border-[#E7E5E4]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address *</FormLabel>
              <FormControl>
                <AddressAutocomplete
                  value={field.value}
                  onChange={field.onChange}
                  onPlaceSelect={(details) => {
                    field.onChange(details.address);
                    if (details.zip && isValidNYCZip(details.zip)) {
                      form.setValue("zip", details.zip);
                    }
                    // Auto-populate borough from API response
                    if (details.borough && (NYC_BOROUGHS as readonly string[]).includes(details.borough)) {
                      form.setValue("borough", details.borough);
                      // Auto-populate neighborhood if it belongs to the detected borough
                      if (details.neighborhood) {
                        const boroughNeighborhoods = BOROUGH_NEIGHBORHOODS[details.borough as NYCBorough];
                        if (boroughNeighborhoods?.includes(details.neighborhood)) {
                          form.setValue("neighborhood", details.neighborhood);
                        } else {
                          form.setValue("neighborhood", "");
                        }
                      } else {
                        form.setValue("neighborhood", "");
                      }
                    } else if (details.neighborhood) {
                      // Fallback: try to detect borough from neighborhood name
                      for (const [borough, neighborhoods] of Object.entries(BOROUGH_NEIGHBORHOODS)) {
                        if (neighborhoods.includes(details.neighborhood)) {
                          form.setValue("borough", borough);
                          form.setValue("neighborhood", details.neighborhood);
                          break;
                        }
                      }
                    }
                  }}
                  placeholder="Start typing an address..."
                  className="bg-white dark:bg-gray-800 border-[#E7E5E4]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>City</FormLabel>
            <Input
              value="New York"
              disabled
              className="bg-gray-100 dark:bg-gray-700 border-[#E7E5E4]"
            />
          </FormItem>

          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 10024"
                    maxLength={5}
                    className="bg-white dark:bg-gray-800 border-[#E7E5E4]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="landlord"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Landlord / Management Company</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., ABC Management"
                  className="bg-white dark:bg-gray-800 border-[#E7E5E4]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="borough"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borough *</FormLabel>
              <Select onValueChange={(value) => handleBoroughChange(value, field.onChange)} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-[#E7E5E4]">
                    <SelectValue placeholder="Select borough" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {NYC_BOROUGHS.map((borough) => (
                    <SelectItem key={borough} value={borough}>
                      {borough}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Neighborhood</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedBorough}
              >
                <FormControl>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-[#E7E5E4]">
                    <SelectValue placeholder={selectedBorough ? "Select neighborhood" : "Select a borough first"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="not_sure">Prefer not to specify / Not sure</SelectItem>
                  {neighborhoodOptions.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buildingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-[#E7E5E4]">
                    <SelectValue placeholder="Select building type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BUILDING_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[#1C1917] hover:bg-[#292524] text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Residence"}
        </Button>
      </form>
    </Form>
  );
}
