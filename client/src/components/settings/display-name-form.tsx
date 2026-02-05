import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

const displayNameSchema = z.object({
  displayName: z.string().max(50, "Display name must be 50 characters or less").optional(),
});

type DisplayNameValues = z.infer<typeof displayNameSchema>;

interface DisplayNameFormProps {
  currentDisplayName: string | null;
}

export function DisplayNameForm({ currentDisplayName }: DisplayNameFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const form = useForm<DisplayNameValues>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: {
      displayName: currentDisplayName ?? "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: DisplayNameValues) => {
      const res = await apiRequest("PATCH", "/api/user/display-name", data);
      return res.json();
    },
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message.includes(":")
          ? error.message.split(": ")[1]
          : "Failed to update display name. Please try again.",
      });
    },
  });

  const onSubmit = (data: DisplayNameValues) => {
    setSuccess(false);
    updateMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Display name updated successfully!
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name (public)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your display name"
                    maxLength={50}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This name will be shown publicly on your non-anonymous reviews.
                  Leave blank to show "NYC Renter" instead.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-[#ebba48] hover:bg-[#C49A3C] text-white"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Display Name"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
