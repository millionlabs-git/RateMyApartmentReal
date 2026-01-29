import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/layout";

export default function Contact() {
  return (
    <Layout showSkyline>
      <div className="flex-1 flex flex-col">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4 flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
              Contact Us
            </h1>
            <p className="text-white/70">
              Have a question or feedback? We'd love to hear from you.
            </p>
          </div>
        </div>

        {/* Content section */}
        <div className="flex-1 flex flex-col items-center px-4 -mt-8 pb-12">
          <Card liquid className="w-full max-w-3xl">
            <CardContent className="pt-8 pb-8">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  Get in Touch
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  Whether you have a question about the platform, need help with your account,
                  want to report an issue, or just want to share your thoughts — our team is
                  here to help.
                </p>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#ebba48]/10 mb-6">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-[#ebba48]/20 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-[#ebba48]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1C1917] dark:text-white mb-0.5">Email</p>
                    <a
                      href="mailto:admin@ratemyapartment.com"
                      className="text-[#ebba48] hover:underline"
                    >
                      admin@ratemyapartment.com
                    </a>
                  </div>
                </div>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  What to Include
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-4">
                  To help us respond as quickly as possible, please include:
                </p>
                <ul className="list-disc list-inside text-[#57534E] dark:text-gray-400 space-y-2 mb-6">
                  <li>A clear description of your question or issue</li>
                  <li>The email address associated with your account (if applicable)</li>
                  <li>Any relevant building addresses or review details</li>
                  <li>Screenshots if you're reporting a bug</li>
                </ul>

                <p className="text-[#57534E] dark:text-gray-400">
                  We aim to respond to all inquiries promptly. Thank you for helping us
                  improve Rate My Apartment for the entire community.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
