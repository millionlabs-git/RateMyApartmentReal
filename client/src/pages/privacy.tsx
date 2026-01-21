import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <Layout showSkyline>
      <div className="flex-1 flex flex-col">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-16 px-4 flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
              Privacy Policy
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
                  1. Introduction
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  Rate My Apartment ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  2. Information We Collect
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-[#57534E] dark:text-gray-400 space-y-2 mb-4">
                  <li><strong>Account Information:</strong> Email address, username, and password when you create an account</li>
                  <li><strong>Profile Information:</strong> Optional information you choose to add to your profile</li>
                  <li><strong>Review Content:</strong> Reviews, ratings, and comments you submit about buildings</li>
                  <li><strong>Communications:</strong> Information you provide when contacting us for support</li>
                </ul>
                <p className="text-[#57534E] dark:text-gray-400 mb-4">
                  We also automatically collect certain information when you use our Service:
                </p>
                <ul className="list-disc list-inside text-[#57534E] dark:text-gray-400 space-y-2 mb-6">
                  <li><strong>Usage Data:</strong> Pages visited, features used, and actions taken on our platform</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
                  <li><strong>Log Data:</strong> IP address, access times, and referring website addresses</li>
                </ul>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-[#57534E] dark:text-gray-400 space-y-2 mb-6">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process and display your reviews and ratings</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Detect, investigate, and prevent fraudulent or unauthorized activity</li>
                  <li>Enforce our Terms of Service and community guidelines</li>
                </ul>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  4. Information Sharing
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-4">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-[#57534E] dark:text-gray-400 space-y-2 mb-6">
                  <li><strong>Public Reviews:</strong> Reviews you submit are publicly visible to other users</li>
                  <li><strong>Service Providers:</strong> With third parties who perform services on our behalf</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  5. Data Security
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  6. Data Retention
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  We retain your personal information for as long as your account is active or as needed to provide you services. We may also retain certain information as required by law or for legitimate business purposes, such as resolving disputes and enforcing our agreements.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  7. Your Rights and Choices
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-[#57534E] dark:text-gray-400 space-y-2 mb-6">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from promotional communications at any time</li>
                </ul>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  8. Cookies and Tracking
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  We use cookies and similar tracking technologies to collect information about your browsing activities. These help us improve your experience, analyze usage patterns, and remember your preferences. You can control cookie settings through your browser, though some features may not function properly if cookies are disabled.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  9. Children's Privacy
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  10. Changes to This Policy
                </h2>
                <p className="text-[#57534E] dark:text-gray-400 mb-6">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the Service after any changes constitutes acceptance of the updated policy.
                </p>

                <h2 className="font-serif text-xl text-[#1C1917] dark:text-white mb-4">
                  11. Contact Us
                </h2>
                <p className="text-[#57534E] dark:text-gray-400">
                  If you have any questions about this Privacy Policy or our data practices, please contact us through our website.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
