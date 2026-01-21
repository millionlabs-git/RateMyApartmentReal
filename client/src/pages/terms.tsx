import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <Layout showSkyline>
      <div className="flex-1 flex flex-col">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4 flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
              Terms of Service
            </h1>
            <p className="text-white/70">
              Last updated: January 2025
            </p>
          </div>
        </div>

        {/* Content section */}
        <div className="flex-1 flex flex-col items-center px-4 -mt-8 pb-12">
          <Card liquid className="w-full max-w-3xl">
            <CardContent className="pt-8 pb-8">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  By accessing or using Rate My Apartment ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any changes.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  2. Description of Service
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  Rate My Apartment is a platform that allows users to search for residential buildings in New York City and read or submit reviews about their rental experiences. The Service is provided for informational purposes only and should not be the sole basis for any housing decision.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  3. User Accounts
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-4">
                  To submit reviews, you must create an account and provide accurate information. You are responsible for:
                </p>
                <ul className="list-disc list-inside text-[#57534E] dark:text-gray-400 space-y-2 mb-6">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your account information remains accurate and current</li>
                </ul>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  4. User Content and Reviews
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-4">
                  When submitting reviews or other content, you agree that:
                </p>
                <ul className="list-disc list-inside text-[#57534E] dark:text-gray-400 space-y-2 mb-6">
                  <li>Your reviews are based on genuine personal experiences</li>
                  <li>You will not post false, misleading, defamatory, or fraudulent content</li>
                  <li>You will not include personal information about other individuals</li>
                  <li>You grant us a non-exclusive, royalty-free license to use, display, and distribute your content</li>
                  <li>We may remove or edit content that violates these terms or our community guidelines</li>
                </ul>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  5. Prohibited Conduct
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-[#57534E] dark:text-gray-400 space-y-2 mb-6">
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Harass, threaten, or intimidate other users</li>
                  <li>Post spam, promotional content, or advertisements</li>
                  <li>Attempt to manipulate ratings or reviews</li>
                  <li>Create multiple accounts to circumvent restrictions</li>
                  <li>Interfere with the proper functioning of the Service</li>
                  <li>Scrape or collect data from the Service without permission</li>
                </ul>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  6. Intellectual Property
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  The Service and its original content (excluding user-submitted content) are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  7. Disclaimer of Warranties
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  The Service is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of any reviews or information on the platform. User reviews represent individual opinions and experiences and may not reflect typical conditions.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  To the fullest extent permitted by law, Rate My Apartment shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. This includes any decisions made based on information found on our platform.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  9. Indemnification
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  You agree to indemnify and hold harmless Rate My Apartment and its operators from any claims, damages, or expenses arising from your use of the Service, your submitted content, or your violation of these terms.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  10. Termination
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our discretion. Upon termination, your right to use the Service will immediately cease.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  11. Governing Law
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  These terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  12. Contact Us
                </h2>
                <p className="text-[#57534E] dark:text-gray-400">
                  If you have any questions about these Terms of Service, please contact us through our website.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
