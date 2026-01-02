import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface NotificationPreferencesProps {
  emailNotifications: boolean;
}

export function NotificationPreferences({ emailNotifications: initialValue }: NotificationPreferencesProps) {
  const [emailNotifications, setEmailNotifications] = useState(initialValue);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const res = await apiRequest("PATCH", "/api/user/preferences", {
        emailNotifications: enabled,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved.",
      });
    },
    onError: () => {
      setEmailNotifications(!emailNotifications);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update preferences. Please try again.",
      });
    },
  });

  const handleToggle = (checked: boolean) => {
    setEmailNotifications(checked);
    updateMutation.mutate(checked);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email-notifications" className="text-base">
            Email Notifications
          </Label>
          <p className="text-sm text-gray-500">
            Receive email updates when your reviews are approved or denied.
          </p>
        </div>
        <Switch
          id="email-notifications"
          checked={emailNotifications}
          onCheckedChange={handleToggle}
          disabled={updateMutation.isPending}
        />
      </div>
    </div>
  );
}
