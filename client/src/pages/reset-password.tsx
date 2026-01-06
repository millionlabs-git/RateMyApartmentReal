import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout/layout";
import { XCircle } from "lucide-react";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tokenValidation, isLoading, error } = useQuery({
    queryKey: ["/api/auth/reset-password", token],
    queryFn: async () => {
      const res = await fetch(`/api/auth/reset-password/${token}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid token");
      }
      return data;
    },
    retry: false,
  });

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: ResetPasswordValues) => {
      const res = await apiRequest("POST", "/api/auth/reset-password", {
        token,
        ...data,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Password reset successful",
        description: "You have been logged in with your new password.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: error.message.includes(":")
          ? error.message.split(": ")[1]
          : "Failed to reset password. Please try again.",
      });
    },
  });

  const onSubmit = (data: ResetPasswordValues) => {
    resetMutation.mutate(data);
  };

  const password = form.watch("password");

  if (isLoading) {
    return (
      <Layout showSkyline>
        <div className="flex-1 flex flex-col">
          <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4">
            <div className="max-w-md mx-auto text-center">
              <Skeleton className="h-10 w-48 mx-auto mb-2 bg-white/10" />
              <Skeleton className="h-5 w-64 mx-auto bg-white/10" />
            </div>
          </div>
          <div className="flex-1 flex items-start justify-center px-4 -mt-8 pb-12">
            <Card liquid className="w-full max-w-md">
              <CardContent className="pt-8 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !tokenValidation?.data?.valid) {
    return (
      <Layout showSkyline>
        <div className="flex-1 flex flex-col">
          <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4">
            <div className="max-w-md mx-auto text-center">
              <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
                Invalid Link
              </h1>
              <p className="text-white/70">
                This link has expired
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-start justify-center px-4 -mt-8 pb-12">
            <Card liquid className="w-full max-w-md">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-3">
                  Link Expired
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  {(error as Error)?.message || "This reset link has expired. Please request a new one."}
                </p>
                <Link href="/login">
                  <Button className="bg-[#ebba48] hover:bg-[#C49A3C] text-white px-6 rounded-xl">
                    Back to Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSkyline>
      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
              Reset Password
            </h1>
            <p className="text-white/70">
              Create a new secure password
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center px-4 -mt-8 pb-12">
          <Card liquid className="w-full max-w-md">
            <CardHeader className="text-center pt-8">
              <CardTitle className="font-serif text-xl">Create New Password</CardTitle>
              <CardDescription>
                Enter your new password below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create a new password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <PasswordStrength password={password} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#ebba48] hover:bg-[#C49A3C] text-white rounded-xl"
                    disabled={resetMutation.isPending}
                  >
                    {resetMutation.isPending ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
