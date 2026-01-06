import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

const emailChangeSchema = z.object({
  newEmail: z.string().email("Invalid email format"),
});

type EmailChangeValues = z.infer<typeof emailChangeSchema>;

interface EmailChangeFormProps {
  currentEmail: string;
}

export function EmailChangeForm({ currentEmail }: EmailChangeFormProps) {
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);

  const form = useForm<EmailChangeValues>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  const changeMutation = useMutation({
    mutationFn: async (data: EmailChangeValues) => {
      const res = await apiRequest("POST", "/api/user/change-email", data);
      return res.json();
    },
    onSuccess: () => {
      setSuccess(true);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message.includes(":")
          ? error.message.split(": ")[1]
          : "Failed to change email. Please try again.",
      });
    },
  });

  const onSubmit = (data: EmailChangeValues) => {
    setSuccess(false);
    changeMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Current email: <span className="font-medium">{currentEmail}</span>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Verification email sent! Please check your inbox and click the link to confirm your new email address.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="new@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-[#ebba48] hover:bg-[#C49A3C] text-white"
            disabled={changeMutation.isPending}
          >
            {changeMutation.isPending ? "Sending..." : "Send Verification Email"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
