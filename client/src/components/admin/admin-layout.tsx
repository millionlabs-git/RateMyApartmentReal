import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, FileText, Building2, LogOut, GitMerge } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: FileText },
  { href: "/admin/buildings", label: "Buildings", icon: Building2 },
  { href: "/admin/duplicates", label: "Duplicates", icon: GitMerge, showBadge: true },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const { data: duplicatesCount } = useQuery<{ data: { count: number } }>({
    queryKey: ["admin", "duplicates", "count"],
    queryFn: async () => {
      const res = await fetch("/api/admin/duplicates/count");
      if (!res.ok) return { data: { count: 0 } };
      return res.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/">
            <h1 className="font-serif text-xl text-[#1C1917] dark:text-white cursor-pointer hover:text-[#B45309] transition-colors">
              RateMyApartment
            </h1>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href ||
                (item.href !== "/admin" && location.startsWith(item.href));
              const badgeCount = item.showBadge ? duplicatesCount?.data?.count || 0 : 0;
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a
                      className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#B45309] text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {badgeCount > 0 && (
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                          }`}
                        >
                          {badgeCount}
                        </Badge>
                      )}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300"
            onClick={() => logout()}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
