import { useQuery } from "@tanstack/react-query";
import { Users, Building2, FileText, Clock } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminStats {
  totalUsers: number;
  totalBuildings: number;
  totalReviews: number;
  pendingBuildings: number;
  pendingReviews: number;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[#1C1917] dark:text-white">
          {value}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery<{ data: AdminStats }>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to load stats");
      return res.json();
    },
  });

  const stats = data?.data;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#1C1917] dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of your platform
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">Failed to load dashboard stats</div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
            />
            <StatCard
              title="Total Buildings"
              value={stats.totalBuildings}
              icon={Building2}
            />
            <StatCard
              title="Total Reviews"
              value={stats.totalReviews}
              icon={FileText}
            />
            <StatCard
              title="Pending Items"
              value={stats.pendingBuildings + stats.pendingReviews}
              icon={Clock}
              description={`${stats.pendingBuildings} buildings, ${stats.pendingReviews} reviews`}
            />
          </div>

          {(stats.pendingBuildings > 0 || stats.pendingReviews > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">
                  Items Requiring Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.pendingReviews > 0 && (
                    <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-amber-600" />
                        <span className="font-medium text-amber-800 dark:text-amber-200">
                          {stats.pendingReviews} reviews pending moderation
                        </span>
                      </div>
                      <a
                        href="/admin/reviews"
                        className="text-sm text-amber-600 hover:underline"
                      >
                        Review now
                      </a>
                    </div>
                  )}
                  {stats.pendingBuildings > 0 && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800 dark:text-blue-200">
                          {stats.pendingBuildings} buildings pending approval
                        </span>
                      </div>
                      <a
                        href="/admin/buildings"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Review now
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}
    </AdminLayout>
  );
}
