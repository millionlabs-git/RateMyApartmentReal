import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "wouter";
import { Menu, User, LogOut, Shield, Settings, FileText, Search } from "lucide-react";
import { SmartSearch } from "@/components/buildings/smart-search";
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

// Import logo as asset
import logoImage from "@assets/rate_my_apartment_horizontal_full_(1)_1767106423750.png";

// Videos are served from public folder for better production compatibility
const nycDayVideo = "/nyc-day.mp4";
const nycNightVideo = "/nyc-background.mp4";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { isDark } = useTheme();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();

  const dayVideoRef = useRef<HTMLVideoElement>(null);
  const nightVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle video loaded state
  useEffect(() => {
    const activeVideo = isDark ? nightVideoRef.current : dayVideoRef.current;
    
    if (!activeVideo) return;
    
    const handleCanPlay = () => {
      setVideoLoaded(true);
    };
    
    // Check if already loaded
    if (activeVideo.readyState >= 3) {
      setVideoLoaded(true);
    } else {
      activeVideo.addEventListener('canplaythrough', handleCanPlay);
    }
    
    return () => {
      activeVideo.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, [isDark]);

  // Synchronize and optimize video playback
  useEffect(() => {
    const dayVideo = dayVideoRef.current;
    const nightVideo = nightVideoRef.current;
    
    if (!dayVideo || !nightVideo) return;
    
    const syncAndSwitch = (
      activeVideo: HTMLVideoElement,
      inactiveVideo: HTMLVideoElement
    ) => {
      const time = inactiveVideo.currentTime || 0;
      if ('fastSeek' in activeVideo && typeof (activeVideo as any).fastSeek === 'function') {
        (activeVideo as any).fastSeek(time);
      } else {
        activeVideo.currentTime = time;
      }
      activeVideo.play().catch(() => {});
      inactiveVideo.pause();
    };
    
    if (isDark) {
      syncAndSwitch(nightVideo, dayVideo);
    } else {
      syncAndSwitch(dayVideo, nightVideo);
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 md:py-6 flex justify-between items-center transition-all duration-400 ${
          scrolled
            ? "liquid-glass-header liquid-edge py-3 md:py-4"
            : ""
        }`}
        data-testid="navbar"
      >
        <a
          href="/"
          className="transition-all duration-400 overflow-hidden"
          data-testid="link-logo"
        >
          <div className="h-12 md:h-[58px] overflow-hidden flex items-center">
            <img 
              src={logoImage} 
              alt="Rate My Apartment" 
              className={`h-[115px] md:h-[134px] w-auto -my-7 transition-all duration-400 ${
                scrolled && !isDark ? "" : "brightness-0 invert"
              }`}
            />
          </div>
        </a>

        <div className="flex items-center gap-4 md:gap-8">
          <a
            href="/search"
            className={`hidden md:block text-sm font-medium transition-colors ${
              scrolled
                ? "text-[#57534E] hover:text-[#1C1917] dark:text-gray-400 dark:hover:text-white"
                : "text-white/85 hover:text-white"
            }`}
            data-testid="link-search"
          >
            Search
          </a>
          <a
            href="/add-building"
            className={`hidden md:block text-sm font-medium transition-colors ${
              scrolled
                ? "text-[#57534E] hover:text-[#1C1917] dark:text-gray-400 dark:hover:text-white"
                : "text-white/85 hover:text-white"
            }`}
            data-testid="link-add-building"
          >
            Add Residence
          </a>
          {isAuthenticated && (
            <a
              href="/my-reviews"
              className={`hidden md:block text-sm font-medium transition-colors ${
                scrolled
                  ? "text-[#57534E] hover:text-[#1C1917] dark:text-gray-400 dark:hover:text-white"
                  : "text-white/85 hover:text-white"
              }`}
              data-testid="link-my-reviews"
            >
              My Reviews
            </a>
          )}

          {/* Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle
              className={
                scrolled
                  ? "text-[#57534E] hover:text-[#1C1917] dark:text-gray-400 dark:hover:text-white"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }
            />
          </div>

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`hidden md:flex items-center gap-2 ${
                    scrolled
                      ? "text-[#57534E] hover:text-[#1C1917] hover:bg-black/5 dark:text-gray-400 dark:hover:text-white"
                      : "text-white/85 hover:text-white hover:bg-white/10"
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
                <DropdownMenuItem asChild>
                  <Link href="/my-reviews">
                    <a className="flex items-center gap-2 w-full">
                      <FileText className="w-4 h-4" />
                      My Reviews
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <a className="flex items-center gap-2 w-full">
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
            <>
              <a
                href="/login"
                className={`hidden md:block text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-[#57534E] hover:text-[#1C1917] dark:text-gray-400 dark:hover:text-white"
                    : "text-white/85 hover:text-white"
                }`}
                data-testid="link-login"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="hidden md:block text-sm font-medium px-4 py-2.5 rounded-md transition-all hover:-translate-y-0.5 hover:shadow-lg bg-[#ebba48] text-white"
                data-testid="link-signup"
              >
                Create Account
              </a>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={`md:hidden ${
                  scrolled ? "text-[#1C1917]" : "text-white"
                }`}
                data-testid="button-mobile-menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-white dark:bg-gray-900">
              <nav className="flex flex-col gap-6 mt-8">
                <a
                  href="/search"
                  className="text-lg font-medium text-[#1C1917] dark:text-white hover:text-[#ebba48] transition-colors"
                  data-testid="mobile-link-search"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Search Buildings
                </a>
                <a
                  href="/add-building"
                  className="text-lg font-medium text-[#1C1917] dark:text-white hover:text-[#ebba48] transition-colors"
                  data-testid="mobile-link-add-building"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Add Residence
                </a>

                {isAuthenticated && user ? (
                  <>
                    <a
                      href="/my-reviews"
                      className="text-lg font-medium text-[#1C1917] dark:text-white hover:text-[#ebba48] transition-colors flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FileText className="w-5 h-5" />
                      My Reviews
                    </a>
                    {user.role === "admin" && (
                      <a
                        href="/admin"
                        className="text-lg font-medium text-[#1C1917] dark:text-white hover:text-[#ebba48] transition-colors flex items-center gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5" />
                        Admin Dashboard
                      </a>
                    )}
                    <a
                      href="/settings"
                      className="text-lg font-medium text-[#1C1917] dark:text-white hover:text-[#ebba48] transition-colors flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      Account Settings
                    </a>
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
                    <a
                      href="/login"
                      className="text-lg font-medium text-[#1C1917] dark:text-white hover:text-[#ebba48] transition-colors"
                      data-testid="mobile-link-login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </a>
                    <a
                      href="/signup"
                      className="inline-flex items-center justify-center bg-[#ebba48] text-white px-6 py-3 rounded-md text-base font-medium hover:bg-[#C49A3C] transition-colors mt-2"
                      data-testid="mobile-link-signup"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Account
                    </a>
                  </>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <ThemeToggle />
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                  Reviews can be posted anonymously
                </p>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex flex-col items-center justify-center text-center px-4 md:px-8 overflow-hidden">
        {/* Day Video Background */}
        <video
          ref={dayVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isDark ? "opacity-0" : "opacity-100"
          }`}
          poster="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920&q=80"
          data-testid="video-background-day"
        >
          <source src={nycDayVideo} type="video/mp4" />
        </video>

        {/* Night Video Background */}
        <video
          ref={nightVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
          poster="/nyc-night.jpg"
          data-testid="video-background-night"
        >
          <source src={nycNightVideo} type="video/mp4" />
        </video>

        {/* Dark Overlay - deeper for night mode */}
        <div className={`absolute inset-0 transition-colors duration-500 ${
          isDark
            ? "bg-gradient-to-b from-black/50 via-black/60 to-black/75"
            : "bg-gradient-to-b from-black/35 via-black/45 to-black/60"
        }`} />

        {/* Loading Screen */}
        <div 
          className={`absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#1C1917] transition-opacity duration-700 ${
            videoLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          data-testid="loading-screen"
        >
          {/* Animated NYC Skyline */}
          <div className="relative mb-8">
            <div className="flex items-end gap-1 h-24">
              {[40, 65, 55, 80, 45, 70, 50, 85, 60, 75].map((baseHeight, i) => (
                <div
                  key={i}
                  className="w-3 md:w-4 bg-gradient-to-t from-[#ebba48] to-[#ebba48] rounded-t-sm"
                  style={{
                    animation: `skylineBounce 1.2s ease-in-out infinite`,
                    animationDelay: `${i * 80}ms`,
                    height: `${baseHeight}px`
                  }}
                />
              ))}
            </div>
            {/* Ground line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ebba48]" />
          </div>
          
          {/* Loading Text */}
          <div className="text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-3">
              Rate My Apartment
            </h2>
            <div className="flex items-center justify-center gap-1 text-white/60 text-sm">
              <span>Loading NYC</span>
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className={`relative z-10 max-w-[700px] transition-opacity duration-700 ${
          videoLoaded ? "animate-fadeIn" : "opacity-0"
        }`}>
          <h1
            className="font-serif text-4xl md:text-5xl lg:text-[4rem] font-normal text-white leading-[1.1] tracking-tight mb-5"
            data-testid="text-hero-title"
          >
            Know Before You Rent.
          </h1>
          <p
            className="text-lg md:text-xl text-white/85 mb-10 md:mb-12 font-normal"
            data-testid="text-hero-mission"
          >
            Honest, anonymous reviews from real NYC renters.
          </p>

          {/* Smart Search Box */}
          <div className="w-full max-w-[600px] mx-auto">
            <SmartSearch
              variant="hero"
              placeholder="Search by building name or address..."
              className="smart-search-hero"
            />

            <button
              onClick={() => {
                document.querySelector<HTMLInputElement>('.smart-search-hero input')?.focus();
              }}
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-[#ebba48] hover:bg-[#d4a73d] text-[#1C1917] font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-black/20"
              data-testid="btn-hero-cta"
            >
              <Search className="w-4 h-4" />
              Find your building
            </button>

            <p className="mt-4 text-sm text-white/60">
              Try searching for{" "}
              <a
                href="/search?q=The+Belnord"
                className="text-white underline underline-offset-2 decoration-white/40 hover:decoration-white transition-colors"
                data-testid="link-example-search"
              >
                The Belnord
              </a>
              {" "}or any NYC address to see if it's been reviewed.
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 text-xs tracking-widest uppercase transition-opacity duration-700 delay-500 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}>
          <span>Scroll</span>
          <span className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white dark:bg-gray-900 transition-colors duration-500" data-testid="section-how-it-works">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#ebba48] mb-3">
              How It Works
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-normal text-[#1C1917] dark:text-white tracking-tight transition-colors">
              Real Reviews, Real Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="text-center px-4" data-testid="step-1">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FDFAF6] dark:bg-gray-800 rounded-full font-serif text-2xl text-[#1C1917] dark:text-white mb-6 transition-colors">
                1
              </div>
              <h3 className="font-serif text-xl md:text-[1.375rem] font-normal text-[#1C1917] dark:text-white mb-3 transition-colors">
                Search Buildings
              </h3>
              <p className="text-[0.9375rem] text-[#57534E] dark:text-gray-400 leading-relaxed transition-colors">
                Enter any NYC address or building name to find reviews from real tenants.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center px-4" data-testid="step-2">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FDFAF6] dark:bg-gray-800 rounded-full font-serif text-2xl text-[#1C1917] dark:text-white mb-6 transition-colors">
                2
              </div>
              <h3 className="font-serif text-xl md:text-[1.375rem] font-normal text-[#1C1917] dark:text-white mb-3 transition-colors">
                Read Reviews
              </h3>
              <p className="text-[0.9375rem] text-[#57534E] dark:text-gray-400 leading-relaxed transition-colors">
                Get honest insights on noise, cleanliness, maintenance, safety, and more.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center px-4" data-testid="step-3">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FDFAF6] dark:bg-gray-800 rounded-full font-serif text-2xl text-[#1C1917] dark:text-white mb-6 transition-colors">
                3
              </div>
              <h3 className="font-serif text-xl md:text-[1.375rem] font-normal text-[#1C1917] dark:text-white mb-3 transition-colors">
                Share Your Experience
              </h3>
              <p className="text-[0.9375rem] text-[#57534E] dark:text-gray-400 leading-relaxed transition-colors">
                Help fellow renters by anonymously reviewing your building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 md:px-8 border-t border-[#E7E5E4] dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-500">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <div className="h-14 overflow-hidden flex items-center" data-testid="footer-logo">
            <img 
              src={logoImage} 
              alt="Rate My Apartment" 
              className={`h-[135px] w-auto -my-7 transition-all duration-400 ${isDark ? "brightness-0 invert" : ""}`}
            />
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <a
              href="/about"
              className="text-[0.8125rem] text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white transition-colors"
              data-testid="link-about"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-[0.8125rem] text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white transition-colors"
              data-testid="link-contact"
            >
              Contact
            </a>
            <Link
              href="/privacy"
              className="text-[0.8125rem] text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white transition-colors"
              data-testid="link-privacy"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[0.8125rem] text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white transition-colors"
              data-testid="link-terms"
            >
              Terms
            </Link>
          </div>

          <span className="text-[0.8125rem] text-[#A8A29E]" data-testid="text-copyright">
            © 2025 Rate My Apartment
          </span>
        </div>
      </footer>
    </div>
  );
}
