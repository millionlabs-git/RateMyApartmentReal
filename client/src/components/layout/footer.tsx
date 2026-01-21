import { Link } from "wouter";
import { useTheme } from "@/components/theme-provider";

import logoImage from "@assets/rate_my_apartment_horizontal_full_(1)_1767106423750.png";

export function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className="footer-fade relative z-10 py-8 md:py-12 px-4 md:px-8 transition-colors duration-500">
      <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <Link href="/">
          <a className="h-14 overflow-hidden flex items-center" data-testid="footer-logo">
            <img
              src={logoImage}
              alt="Rate My Apartment"
              className={`h-[135px] w-auto -my-7 transition-all duration-400 ${
                isDark ? "brightness-0 invert" : ""
              }`}
            />
          </a>
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/about">
            <a
              className="text-[0.8125rem] text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white transition-colors"
              data-testid="link-about"
            >
              About
            </a>
          </Link>
          <Link href="/privacy">
            <a
              className="text-[0.8125rem] text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white transition-colors"
              data-testid="link-privacy"
            >
              Privacy
            </a>
          </Link>
          <Link href="/terms">
            <a
              className="text-[0.8125rem] text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white transition-colors"
              data-testid="link-terms"
            >
              Terms
            </a>
          </Link>
        </div>

        <span className="text-[0.8125rem] text-[#A8A29E]" data-testid="text-copyright">
          © 2025 Rate My Apartment
        </span>
      </div>
    </footer>
  );
}
