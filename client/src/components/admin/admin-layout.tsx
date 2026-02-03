import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, FileText, Building2, LogOut, GitMerge, Mail } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logoImage from "@assets/rate_my_apartment_horizontal_full_(1)_1767106423750.png";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: FileText },
  { href: "/admin/buildings", label: "Buildings", icon: Building2 },
  { href: "/admin/waitlist", label: "Waitlist", icon: Mail },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-r border-white/50 dark:border-gray-700/50 flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <Link href="/">
            <div className="h-10 overflow-hidden flex items-center cursor-pointer">
              <img
                src={logoImage}
                alt="Rate My Apartment"
                className="h-[90px] w-auto -my-5 dark:brightness-0 dark:invert"
              />
            </div>
          </Link>
          <p className="text-xs text-gray-500 mt-2">Admin Dashboard</p>
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
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-[#ebba48] to-[#ebba48] text-white shadow-lg shadow-amber-500/25"
                          : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:shadow-md"
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
