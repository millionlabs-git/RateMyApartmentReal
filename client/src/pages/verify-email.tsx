import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/user/verify-email", token],
    queryFn: async () => {
      const res = await fetch(`/api/user/verify-email/${token}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }
      return data;
    },
    retry: false,
  });

  useEffect(() => {
    if (data?.data?.newEmail) {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    }
  }, [data, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </CardHeader>
          <CardContent className="text-center">
            <Skeleton className="h-10 w-32 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="font-serif text-2xl text-red-600">Verification Failed</CardTitle>
            <CardDescription>
              {(error as Error).message}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/settings">
              <Button className="bg-[#B45309] hover:bg-[#92400E] text-white">
                Go to Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="font-serif text-2xl text-green-600">Email Verified!</CardTitle>
          <CardDescription>
            Your email has been updated to {data?.data?.newEmail}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/settings">
            <Button className="bg-[#B45309] hover:bg-[#92400E] text-white">
              Go to Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
