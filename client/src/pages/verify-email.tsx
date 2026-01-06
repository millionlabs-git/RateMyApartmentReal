import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle } from "lucide-react";
import { Layout } from "@/components/layout/layout";

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
      <Layout showSkyline>
        <div className="flex-1 flex flex-col">
          <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4 flex items-center justify-center">
            <div className="text-center">
              <Skeleton className="h-10 w-48 mx-auto mb-2 bg-white/10" />
              <Skeleton className="h-5 w-64 mx-auto bg-white/10" />
            </div>
          </div>
          <div className="flex-1 flex items-start justify-center px-4 -mt-8 pb-12">
            <Card liquid className="w-full max-w-md">
              <CardContent className="pt-8 text-center">
                <Skeleton className="h-16 w-16 mx-auto mb-6 rounded-2xl" />
                <Skeleton className="h-6 w-48 mx-auto mb-3" />
                <Skeleton className="h-4 w-64 mx-auto mb-6" />
                <Skeleton className="h-10 w-32 mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout showSkyline>
        <div className="flex-1 flex flex-col">
          <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4 flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
                Verification Failed
              </h1>
              <p className="text-white/70">
                Unable to verify email
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
                  Verification Failed
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  {(error as Error).message}
                </p>
                <Link href="/settings">
                  <Button className="bg-[#ebba48] hover:bg-[#C49A3C] text-white px-6 rounded-xl">
                    Go to Settings
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
        <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
              Email Verified!
            </h1>
            <p className="text-white/70">
              Your email has been updated
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-start justify-center px-4 -mt-8 pb-12">
          <Card liquid className="w-full max-w-md">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-3">
                Email Verified!
              </h2>
              <p className="text-[#57534E] dark:text-gray-400 mb-6">
                Your email has been updated to {data?.data?.newEmail}
              </p>
              <Link href="/settings">
                <Button className="bg-[#ebba48] hover:bg-[#C49A3C] text-white px-6 rounded-xl">
                  Go to Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
