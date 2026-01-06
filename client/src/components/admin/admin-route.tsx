import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import logoImage from "@assets/rate_my_apartment_horizontal_full_(1)_1767106423750.png";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 overflow-hidden flex items-center justify-center mb-6">
            <img
              src={logoImage}
              alt="Rate My Apartment"
              className="h-[140px] w-auto -my-8 dark:brightness-0 dark:invert animate-pulse"
            />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  if (user.role !== "admin") {
    return <Redirect to="/forbidden" />;
  }

  return <>{children}</>;
}
