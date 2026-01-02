import { useAuth } from "@/hooks/use-auth";
import { EmailChangeForm } from "@/components/settings/email-change-form";
import { PasswordChangeForm } from "@/components/settings/password-change-form";
import { MyReviews } from "@/components/settings/my-reviews";
import { NotificationPreferences } from "@/components/settings/notification-preferences";
import { DeleteAccountModal } from "@/components/settings/delete-account-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFAF6] dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-serif text-3xl font-normal text-[#1C1917] dark:text-white">
          Account Settings
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Email Address</CardTitle>
            <CardDescription>
              Change your email address. A verification link will be sent to your new email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmailChangeForm currentEmail={user.email} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordChangeForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Reviews</CardTitle>
            <CardDescription>
              View all the reviews you've submitted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MyReviews />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage your email notification preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationPreferences emailNotifications={user.emailNotifications} />
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <DeleteAccountModal />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
