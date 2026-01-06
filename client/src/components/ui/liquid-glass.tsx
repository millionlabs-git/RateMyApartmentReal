import { useEffect, useRef, useId, useState } from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  blur?: number;
  borderRadius?: number;
  animated?: boolean;
  variant?: "default" | "card" | "header" | "modal" | "hero";
}

// Utility functions for shader calculations
function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function length(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

function roundedRectSDF(
  px: number,
  py: number,
  bx: number,
  by: number,
  r: number
): number {
  const qx = Math.abs(px) - bx + r;
  const qy = Math.abs(py) - by + r;
  return (
    Math.min(Math.max(qx, qy), 0) +
    length(Math.max(qx, 0), Math.max(qy, 0)) -
    r
  );
}

export function LiquidGlass({
  children,
  className,
  intensity = 30,
  blur = 24,
  borderRadius = 24,
  animated = true,
  variant = "default",
}: LiquidGlassProps) {
  const id = useId().replace(/:/g, "");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Variant-specific settings
  const variantConfig = {
    default: { blur: 24, intensity: 30, borderRadius: 24 },
    card: { blur: 20, intensity: 25, borderRadius: 16 },
    header: { blur: 16, intensity: 20, borderRadius: 0 },
    modal: { blur: 32, intensity: 35, borderRadius: 24 },
    hero: { blur: 28, intensity: 40, borderRadius: 20 },
  };

  const config = variantConfig[variant];
  const finalBlur = blur || config.blur;
  const finalIntensity = intensity || config.intensity;
  const finalBorderRadius = borderRadius || config.borderRadius;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = dimensions;
    canvas.width = width;
    canvas.height = height;

    let time = 0;
    const edgeFade = 0.15;
    const cornerRadius = finalBorderRadius / Math.min(width, height);

    const renderFrame = () => {
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Normalized coordinates (-0.5 to 0.5)
          const u = x / width - 0.5;
          const v = y / height - 0.5;

          // Aspect ratio correction
          const aspectRatio = width / height;
          const adjustedU = u * aspectRatio;

          // Distance from center for radial effect
          const dist = length(adjustedU, v);

          // Rounded rectangle SDF for edge masking
          const sdf = roundedRectSDF(
            u,
            v,
            0.5 - edgeFade,
            0.5 - edgeFade,
            cornerRadius
          );
          const edgeMask = 1 - smoothStep(-edgeFade, 0, sdf);

          // Liquid distortion calculation
          let dispX = 0;
          let dispY = 0;

          if (animated) {
            // Animated waves
            const wave1 = Math.sin(u * 8 + time * 0.5) * Math.cos(v * 6 + time * 0.3);
            const wave2 = Math.sin(v * 7 - time * 0.4) * Math.cos(u * 5 + time * 0.6);
            const wave3 = Math.sin((u + v) * 4 + time * 0.2);

            dispX = (wave1 * 0.3 + wave2 * 0.2 + wave3 * 0.1) * edgeMask;
            dispY = (wave2 * 0.3 + wave1 * 0.2 - wave3 * 0.1) * edgeMask;
          } else {
            // Static liquid lens effect
            const lensStrength = smoothStep(0.5, 0, dist) * 0.5;
            dispX = adjustedU * lensStrength * edgeMask;
            dispY = v * lensStrength * edgeMask;
          }

          // Apply intensity and convert to 0-255 range
          // 128 is neutral (no displacement), values above/below shift in opposite directions
          const r = Math.floor(128 + dispX * finalIntensity * 2);
          const g = Math.floor(128 + dispY * finalIntensity * 2);

          // Edge highlight for glass refraction effect
          const edgeHighlight = smoothStep(0.02, 0, Math.abs(sdf)) * 0.3;
          const b = Math.floor(128 + edgeHighlight * 128);

          const i = (y * width + x) * 4;
          data[i] = Math.max(0, Math.min(255, r));
          data[i + 1] = Math.max(0, Math.min(255, g));
          data[i + 2] = Math.max(0, Math.min(255, b));
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Update SVG filter
      const feImage = document.getElementById(`${id}_map`);
      if (feImage) {
        feImage.setAttribute("href", canvas.toDataURL());
      }

      if (animated) {
        time += 0.016; // ~60fps
        animationRef.current = requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, finalIntensity, finalBorderRadius, animated, id]);

  return (
    <>
      {/* Hidden SVG filter definition */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", visibility: "hidden" }}
      >
        <defs>
          <filter id={`${id}_filter`} colorInterpolationFilters="sRGB">
            <feImage
              id={`${id}_map`}
              result="displacement"
              width={dimensions.width}
              height={dimensions.height}
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="displacement"
              scale={finalIntensity}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Hidden canvas for generating displacement map */}
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

      {/* Main container with glass effect */}
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden",
          className
        )}
        style={{
          borderRadius: `${finalBorderRadius}px`,
          backdropFilter: `blur(${finalBlur}px) saturate(1.8) contrast(1.1) brightness(1.05)`,
          WebkitBackdropFilter: `blur(${finalBlur}px) saturate(1.8) contrast(1.1) brightness(1.05)`,
          filter: dimensions.width > 0 ? `url(#${id}_filter)` : undefined,
          boxShadow: `
            inset 0 0 0 1px rgba(255, 255, 255, 0.2),
            inset 0 2px 20px rgba(255, 255, 255, 0.1),
            0 8px 32px rgba(0, 0, 0, 0.1),
            0 2px 8px rgba(0, 0, 0, 0.05)
          `,
        }}
      >
        {children}
      </div>
    </>
  );
}

// Simplified version for performance-critical areas
export function GlassPanel({
  children,
  className,
  blur = 20,
  borderRadius = 16,
}: {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  borderRadius?: number;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        borderRadius: `${borderRadius}px`,
        backdropFilter: `blur(${blur}px) saturate(1.6) contrast(1.05) brightness(1.02)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(1.6) contrast(1.05) brightness(1.02)`,
        boxShadow: `
          inset 0 0 0 1px rgba(255, 255, 255, 0.15),
          inset 0 1px 10px rgba(255, 255, 255, 0.08),
          0 4px 24px rgba(0, 0, 0, 0.08),
          0 1px 4px rgba(0, 0, 0, 0.04)
        `,
      }}
    >
      {children}
    </div>
  );
}
