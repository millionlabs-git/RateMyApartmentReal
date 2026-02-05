import { useState } from "react";
import { Link } from "wouter";
import { LoginForm } from "@/components/auth/login-form";
import { ForgotPasswordModal } from "@/components/auth/forgot-password-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/layout";

export default function LoginPage() {
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  return (
    <Layout showSkyline>
      <div className="flex-1 flex flex-col">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-white/70">
              Sign in to share your experience — anonymously if you choose.
            </p>
          </div>
        </div>

        {/* Form section */}
        <div className="flex-1 flex items-start justify-center px-4 -mt-8 pb-12">
          <Card liquid className="w-full max-w-md">
            <CardHeader className="text-center pt-8">
              <CardTitle className="font-serif text-xl">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm onForgotPassword={() => setForgotPasswordOpen(true)} />

              <div className="mt-6 text-center text-sm text-[#57534E] dark:text-gray-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#ebba48] hover:underline font-medium">
                  Create one
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </Layout>
  );
}
