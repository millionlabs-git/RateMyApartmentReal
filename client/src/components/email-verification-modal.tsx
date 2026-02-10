import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailVerificationModal({ open, onOpenChange }: EmailVerificationModalProps) {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await apiRequest("POST", "/api/auth/resend-verification");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to resend verification email");
      }
      toast({
        title: "Email Sent",
        description: "A new verification email has been sent. Please check your inbox.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to resend verification email",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Mail className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-center">Verify Your Email</DialogTitle>
          <DialogDescription className="text-center">
            Please verify your email address before submitting content. Check your inbox for a verification link.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleResend}
            disabled={isResending}
            className="w-full bg-[#ebba48] hover:bg-[#C49A3C] text-white"
          >
            {isResending ? "Sending..." : "Resend Verification Email"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
