import { Link } from "wouter";
import { SignupForm } from "@/components/auth/signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/layout";

export default function SignupPage() {
  return (
    <Layout showSkyline>
      <div className="flex-1 flex flex-col">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
              Join the Community
            </h1>
            <p className="text-white/70">
              Create an account to share your reviews
            </p>
          </div>
        </div>

        {/* Form section */}
        <div className="flex-1 flex items-start justify-center px-4 -mt-8 pb-12">
          <Card liquid className="w-full max-w-md">
            <CardHeader className="text-center pt-8">
              <CardTitle className="font-serif text-xl">Create Account</CardTitle>
              <CardDescription>
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignupForm />

              <div className="mt-6 text-center text-sm text-[#57534E] dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-[#ebba48] hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
