import { useAuth } from "@/hooks/use-auth";
import { EmailChangeForm } from "@/components/settings/email-change-form";
import { PasswordChangeForm } from "@/components/settings/password-change-form";
import { NotificationPreferences } from "@/components/settings/notification-preferences";
import { DeleteAccountModal } from "@/components/settings/delete-account-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout/layout";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="py-6 px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout showSkyline>
      {/* Hero section */}
      <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-6 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
            Account Settings
          </h1>
          <p className="text-white/70">
            Manage your account preferences and security settings
          </p>
        </div>
      </div>

      {/* Content section */}
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card liquid>
            <CardHeader>
              <CardTitle className="text-xl">Email Address</CardTitle>
              <CardDescription>
                Change your email address. A verification link will be sent to your new email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailChangeForm currentEmail={user.email} />
            </CardContent>
          </Card>

          <Card liquid>
            <CardHeader>
              <CardTitle className="text-xl">Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordChangeForm />
            </CardContent>
          </Card>

          <Card liquid>
            <CardHeader>
              <CardTitle className="text-xl">Notifications</CardTitle>
              <CardDescription>
                Manage your email notification preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationPreferences emailNotifications={user.emailNotifications} />
            </CardContent>
          </Card>

          <Card liquid className="border-red-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-red-500">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-[#57534E] dark:text-gray-400">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <DeleteAccountModal />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
