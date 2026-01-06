import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, User, LogOut, Shield } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import logoImage from "@assets/rate_my_apartment_horizontal_full_(1)_1767106423750.png";

interface HeaderProps {
  variant?: "default" | "transparent";
}

export function Header({ variant = "default" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark } = useTheme();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // For transparent variant (like home page), start transparent and become solid on scroll
  // For default variant, always show solid background
  const isTransparent = variant === "transparent" && !scrolled;

  // Determine if we should show inverted (white) logo
  const showInvertedLogo = isTransparent || isDark;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 md:py-6 flex justify-between items-center transition-all duration-400 ${
        isTransparent
          ? ""
          : "liquid-glass-header py-3 md:py-4"
      }`}
      data-testid="navbar"
    >
      <Link href="/">
        <a className="transition-all duration-400 overflow-hidden" data-testid="link-logo">
          <div className="h-12 md:h-[58px] overflow-hidden flex items-center">
            <img
              src={logoImage}
              alt="Rate My Apartment"
              className={`h-[115px] md:h-[134px] w-auto -my-7 transition-all duration-400 ${
                showInvertedLogo ? "brightness-0 invert" : ""
              }`}
            />
          </div>
        </a>
      </Link>

      <div className="flex items-center gap-4 md:gap-8">
        <Link href="/search">
          <a
            className={`hidden md:block text-sm font-medium transition-colors ${
              isTransparent
                ? "text-white/85 hover:text-white"
                : "text-[#57534E] hover:text-[#1C1917] dark:text-gray-400 dark:hover:text-white"
            }`}
            data-testid="link-search"
          >
            Search
          </a>
        </Link>
        <Link href="/add-building">
          <a
            className={`hidden md:block text-sm font-medium transition-colors ${
              isTransparent
                ? "text-white/85 hover:text-white"
                : "text-[#57534E] hover:text-[#1C1917] dark:text-gray-400 dark:hover:text-white"
            }`}
            data-testid="link-add-building"
          >
            Add Building
          </a>
        </Link>

        {/* Theme Toggle */}
        <div className="hidden md:block">
          <ThemeToggle variant={isTransparent ? "hero" : "default"} />
        </div>

        {/* Auth Section */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`hidden md:flex items-center gap-2 ${
                  isTransparent
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-[#57534E] hover:text-[#1C1917] dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                <span className="max-w-[120px] truncate">{user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user.role === "admin" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <a className="flex items-center gap-2 w-full">
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="text-red-600 dark:text-red-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <a
              className="hidden md:block text-sm font-medium px-4 py-2.5 rounded-md transition-all hover:-translate-y-0.5 hover:shadow-lg bg-[#ebba48] text-white"
              data-testid="link-login"
            >
              Sign In
            </a>
          </Link>
        )}

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className={`md:hidden ${
                isTransparent ? "text-white" : "text-[#1C1917] dark:text-white"
              }`}
              data-testid="button-mobile-menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-white dark:bg-gray-900">
            <nav className="flex flex-col gap-6 mt-8">
              <Link href="/search">
                <a
                  className="text-lg font-medium text-[#1C1917] dark:text-white hover:text-[#ebba48] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Search Buildings
                </a>
              </Link>
              <Link href="/add-building">
                <a
                  className="text-lg font-medium text-[#1C1917] dark:text-white hover:text-[#ebba48] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Add Building
                </a>
              </Link>

              {isAuthenticated && user ? (
                <>
                  {user.role === "admin" && (
                    <Link href="/admin">
                      <a
                        className="text-lg font-medium text-[#1C1917] dark:text-white hover:text-[#ebba48] transition-colors flex items-center gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5" />
                        Admin Dashboard
                      </a>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    disabled={isLoggingOut}
                    className="text-lg font-medium text-red-600 dark:text-red-400 hover:text-red-700 transition-colors text-left flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    {isLoggingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <a
                      className="text-lg font-medium text-[#1C1917] dark:text-white hover:text-[#ebba48] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </a>
                  </Link>
                  <Link href="/signup">
                    <a
                      className="inline-flex items-center justify-center bg-[#ebba48] text-white px-6 py-3 rounded-md text-base font-medium hover:bg-[#C49A3C] transition-colors mt-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Account
                    </a>
                  </Link>
                </>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <ThemeToggle variant="default" />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
