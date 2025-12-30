import { useState, useEffect, useRef } from "react";
import { Search, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";

// Import logo as asset
import logoImage from "@assets/rate_my_apartment_horizontal_full_(1)_1767106423750.png";

// Videos are served from public folder for better production compatibility
const nycDayVideo = "/nyc-day.mp4";
const nycNightVideo = "/nyc-background.mp4";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { isDark } = useTheme();
  
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 md:py-6 flex justify-between items-center transition-all duration-400 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-sm py-3 md:py-4"
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
              className="h-[115px] md:h-[134px] w-auto -my-7 brightness-0 invert"
            />
          </div>
        </a>

        <div className="flex items-center gap-6 md:gap-10">
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
            href="/add"
            className={`hidden md:block text-sm font-medium transition-colors ${
              scrolled
                ? "text-[#57534E] hover:text-[#1C1917] dark:text-gray-400 dark:hover:text-white"
                : "text-white/85 hover:text-white"
            }`}
            data-testid="link-add-building"
          >
            Add Building
          </a>
          <a
            href="/login"
            className={`hidden md:block text-sm font-medium px-4 py-2.5 rounded-md transition-all hover:-translate-y-0.5 hover:shadow-lg ${
              scrolled
                ? "bg-[#B45309] text-white"
                : "bg-[#B45309] text-white"
            }`}
            data-testid="link-login"
          >
            Sign In
          </a>

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
            <SheetContent side="right" className="w-[280px] bg-white">
              <nav className="flex flex-col gap-6 mt-8">
                <a
                  href="/search"
                  className="text-lg font-medium text-[#1C1917] hover:text-[#B45309] transition-colors"
                  data-testid="mobile-link-search"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Search Buildings
                </a>
                <a
                  href="/add"
                  className="text-lg font-medium text-[#1C1917] hover:text-[#B45309] transition-colors"
                  data-testid="mobile-link-add-building"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Add Building
                </a>
                <a
                  href="/login"
                  className="text-lg font-medium text-[#1C1917] hover:text-[#B45309] transition-colors"
                  data-testid="mobile-link-login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center bg-[#B45309] text-white px-6 py-3 rounded-md text-base font-medium hover:bg-[#92400E] transition-colors mt-2"
                  data-testid="mobile-link-signup"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Account
                </a>
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
                  className="w-3 md:w-4 bg-gradient-to-t from-[#B45309] to-[#F59E0B] rounded-t-sm"
                  style={{
                    animation: `skylineBounce 1.2s ease-in-out infinite`,
                    animationDelay: `${i * 80}ms`,
                    height: `${baseHeight}px`
                  }}
                />
              ))}
            </div>
            {/* Ground line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B45309]" />
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

        {/* Day/Night Toggle */}
        <div className={`absolute top-24 right-6 md:right-12 z-20 transition-opacity duration-500 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}>
          <ThemeToggle variant="hero" />
        </div>

        {/* Hero Content */}
        <div className={`relative z-10 max-w-[700px] transition-opacity duration-700 ${
          videoLoaded ? "animate-fadeIn" : "opacity-0"
        }`}>
          <h1
            className="font-serif text-4xl md:text-5xl lg:text-[4rem] font-normal text-white leading-[1.1] tracking-tight mb-5"
            data-testid="text-hero-title"
          >
            Find Your Perfect NYC Apartment
          </h1>
          <p
            className="text-lg md:text-xl text-white/85 mb-10 md:mb-12 font-normal"
            data-testid="text-hero-mission"
          >
            Honest, anonymous reviews from real NYC renters.
          </p>

          {/* Glassmorphic Search Box */}
          <div className="w-full max-w-[600px] mx-auto">
            <form onSubmit={handleSearch}>
              <div className="relative flex flex-col md:flex-row bg-white/12 backdrop-blur-xl rounded-2xl md:rounded-[20px] border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.1)] overflow-hidden transition-all duration-300 focus-within:bg-white/18 focus-within:border-white/40 focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.15),0_0_0_1px_rgba(255,255,255,0.1)]">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-white/10 pointer-events-none" />

                {/* Search Icon */}
                <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none z-10 hidden md:block" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by building name or address..."
                  className="flex-1 border-none py-5 px-5 md:py-5 md:pl-14 md:pr-4 font-sans text-base text-white bg-transparent placeholder:text-white/60 focus:outline-none relative z-10"
                  data-testid="input-search"
                />

                <button
                  type="submit"
                  className="relative z-10 bg-white/20 text-white border-t md:border-t-0 md:border-l border-white/15 py-4 md:py-5 px-6 md:px-8 font-sans text-[0.9375rem] font-medium cursor-pointer transition-all duration-250 hover:bg-white/30"
                  data-testid="button-search"
                >
                  Search
                </button>
              </div>
            </form>

            <p className="mt-5 text-sm text-white/60">
              Try{" "}
              <a
                href="/search?q=123+Main+St"
                className="text-white underline underline-offset-2 decoration-white/40 hover:decoration-white transition-colors"
                data-testid="link-example-search"
              >
                123 Main Street, Brooklyn
              </a>
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
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B45309] mb-3">
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
          <div className="h-10 overflow-hidden flex items-center" data-testid="footer-logo">
            <img 
              src={logoImage} 
              alt="Rate My Apartment" 
              className="h-[90px] w-auto -my-5"
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
            <a
              href="/privacy"
              className="text-[0.8125rem] text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white transition-colors"
              data-testid="link-privacy"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-[0.8125rem] text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white transition-colors"
              data-testid="link-terms"
            >
              Terms
            </a>
          </div>

          <span className="text-[0.8125rem] text-[#A8A29E]" data-testid="text-copyright">
            © 2025 Rate My Apartment
          </span>
        </div>
      </footer>
    </div>
  );
}
