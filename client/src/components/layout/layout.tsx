import { Header } from "./header";
import { Footer } from "./footer";

interface LayoutProps {
  children: React.ReactNode;
  headerVariant?: "default" | "transparent";
  showFooter?: boolean;
  showSkyline?: boolean;
  className?: string;
}

export function Layout({
  children,
  headerVariant = "default",
  showFooter = true,
  showSkyline = false,
  className = "",
}: LayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-[#FDFAF6] dark:bg-gray-900 ${showSkyline ? 'nyc-skyline-bg' : ''} ${className}`}>
      {showSkyline && (
        <>
          <div className="window-layer-2" />
          <div className="window-layer-3" />
          <div className="window-layer-4" />
          <div className="window-layer-5" />
          <div className="window-layer-6" />
          <div className="window-layer-7" />
          <div className="window-layer-8" />
          <div className="window-layer-9" />
          <div className="window-layer-10" />
          <div className="window-layer-11" />
          <div className="window-layer-12" />
          <div className="window-layer-13" />
          <div className="window-layer-14" />
          <div className="window-layer-15" />
          <div className="window-layer-16" />
          <div className="window-layer-17" />
          <div className="window-layer-18" />
          <div className="window-layer-19" />
          <div className="window-layer-20" />
          <div className="window-layer-21" />
          <div className="window-layer-22" />
          <div className="window-layer-23" />
          <div className="window-layer-24" />
        </>
      )}
      <Header variant={headerVariant} />
      <main className="flex-1 pt-32 flex flex-col">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export { Header } from "./header";
export { Footer } from "./footer";
