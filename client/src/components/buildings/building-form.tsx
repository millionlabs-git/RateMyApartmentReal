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
import { isValidNYCZip, NYC_NEIGHBORHOODS, BUILDING_TYPES } from "@/lib/validation";

const buildingFormSchema = z.object({
  name: z.string().max(255),
  address: z.string().min(1, "Address is required").max(255),
  zip: z.string().length(5, "ZIP code must be 5 digits").refine(isValidNYCZip, {
    message: "Please enter a valid NYC ZIP code",
  }),
  landlord: z.string().max(255).optional(),
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
      neighborhood: "",
      buildingType: "",
    },
  });

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
                    if (details.neighborhood && NYC_NEIGHBORHOODS.includes(details.neighborhood)) {
                      form.setValue("neighborhood", details.neighborhood);
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
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Neighborhood</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-[#E7E5E4]">
                    <SelectValue placeholder="Select neighborhood" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {NYC_NEIGHBORHOODS.map((neighborhood) => (
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
