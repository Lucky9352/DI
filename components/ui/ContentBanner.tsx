"use client";

import { motion, type MotionStyle } from "framer-motion";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/client-browser";
import type { SanityImageSource } from "@sanity/image-url";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ContentBannerData {
  _key?: string | undefined;
  eyebrow?: string | undefined;
  title?: string | undefined;
  highlight?: string | undefined;
  description?: string | undefined;
  features?: string[] | undefined;
  layout?:
    | "bottom-image"
    | "right-image"
    | "left-image"
    | "background-image"
    | "text-only"
    | undefined;
  imageUrl?: string | undefined;
  image?: SanityImageSource | undefined;
  bgOverlay?: "none" | "black-10" | "black-20" | "black-40" | "white-10" | undefined;
  theme?: "light" | "dark" | undefined;
  paragraphs?: string[] | undefined;
  stats?: { value: string; label: string }[] | undefined;
}

interface ContentBannerProps {
  data: ContentBannerData;
  className?: string;
  priority?: boolean;
}

interface FloatingStarProps {
  className?: string;
  delay?: number;
  duration?: number;
}

interface FloatingImageProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  priority?: boolean;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const FloatingStar = ({ className, delay = 0, duration = 15 }: FloatingStarProps) => (
  <motion.div
    className={cn("absolute text-gold/20 pointer-events-none z-0", className)}
    animate={{
      x: [0, 10, -8, 5, 0],
      y: [0, -15, 8, -10, 0],
      rotate: [0, 360],
      scale: [1, 1.1, 0.95, 1.05, 1],
      opacity: [0.3, 0.6, 0.4, 0.5, 0.3],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    }}
  >
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  </motion.div>
);

const FloatingImage = ({
  src,
  className,
  style,
  delay = 0,
  duration = 18,
  priority = false,
}: FloatingImageProps) => (
  <motion.div
    className={cn("absolute pointer-events-none z-0 opacity-80", className)}
    style={style as MotionStyle}
    animate={{
      x: [0, 20, -15, 5, 0],
      y: [0, -25, 15, -10, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.05, 0.98, 1.02, 1],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    }}
  >
    <div className="relative w-full h-full">
      <OptimizedImage
        src={src}
        alt=""
        fill
        className="drop-shadow-lg"
        imageClassName="object-scale-down"
        sizes="100px"
        quality={100}
        priority={priority}
      />
    </div>
  </motion.div>
);

// =============================================================================
// COMPONENT
// =============================================================================

export default function ContentBanner({ data, className, priority = false }: ContentBannerProps) {
  const {
    eyebrow,
    title,
    highlight,
    description,
    features = [],
    layout = "bottom-image",
    imageUrl,
    paragraphs,
    image,
    bgOverlay = "black-20",
    theme = "light",
  } = data;

  const processedImageUrl = imageUrl
    ? getGoogleDriveImageUrl(imageUrl)
    : image
      ? urlFor(image).url()
      : null;

  const isDarkTheme = theme === "dark";

  // ===========================================================================
  // THEME & COLORS
  // ===========================================================================

  // Background Colors
  const bgClasses = cn(
    "relative w-full transition-colors duration-500",
    layout === "background-image" ? "overflow-hidden" : "",
    "min-h-[60vh] lg:min-h-[70vh] flex items-center py-8 md:py-12",
    layout !== "background-image" && isDarkTheme ? "bg-[#5D4037]" : "",
    layout !== "background-image" && !isDarkTheme ? "bg-ivory" : "",
    layout === "background-image" ? "bg-[#3b2f2f]" : "",
    className
  );

  // Text Colors
  const isLightText = isDarkTheme || layout === "background-image";
  const textColor = isLightText ? "text-[#f5f1e8]!" : "text-deep-brown!";
  const descColor = isLightText ? "text-[#f5f1e8]/90!" : "text-deep-brown!";
  const eyebrowColor = isLightText ? "text-[#e0c895]!" : "text-gold-dark!";
  const highlightColor = "text-gold";

  // ===========================================================================
  // FLOATING ELEMENTS
  // ===========================================================================

  const FLOATING_IMAGES = [
    // Top Left Corner
    {
      src: "/almond.png",
      className: "w-10 h-10 md:w-20 md:h-20 opacity-40",
      top: "5%",
      left: "5%",
      delay: 0,
      duration: 18,
    },
    // Top Right Corner
    {
      src: "/cashewsingle.png",
      className: "w-9 h-9 md:w-16 md:h-16 opacity-35",
      top: "8%",
      right: "6%",
      delay: 2.5,
      duration: 22,
    },
    // Middle Left
    {
      src: "/walnut.png",
      className: "w-8 h-8 md:w-15 md:h-15 opacity-30 hidden lg:block",
      top: "45%",
      left: "8%",
      delay: 5,
      duration: 25,
    },
    // Middle Right
    {
      src: "/dates.png",
      className: "w-8 h-8 md:w-14 md:h-14 opacity-35 hidden lg:block",
      top: "40%",
      right: "5%",
      delay: 1.2,
      duration: 20,
    },
    // Bottom Left
    {
      src: "/hazelnut.png",
      className: "w-12 h-12 md:w-22 md:h-22 opacity-45",
      bottom: "10%",
      left: "4%",
      delay: 3,
      duration: 28,
    },
    // Bottom Right
    {
      src: "/raisin.png",
      className: "w-9 h-9 md:w-17 md:h-17 opacity-35",
      bottom: "12%",
      right: "7%",
      delay: 6,
      duration: 24,
    },
    // subtle accent center-right
    {
      src: "/almond.png",
      className: "w-6 h-6 md:w-11 md:h-11 opacity-20 hidden md:block",
      top: "25%",
      right: "25%",
      delay: 8,
      duration: 30,
    },
    // subtle accent center-left
    {
      src: "/cashewsingle.png",
      className: "w-7 h-7 md:w-12 md:h-12 opacity-20 hidden md:block",
      bottom: "35%",
      left: "20%",
      delay: 4,
      duration: 26,
    },
  ];

  const FloatingElements = isDarkTheme ? (
    <>
      {/* Reduced Stars */}
      <FloatingStar className="top-[12%] left-[15%] w-8 h-8 opacity-30" delay={0} duration={18} />
      <FloatingStar className="top-[18%] right-[22%] w-6 h-6 opacity-25" delay={4} duration={22} />
      <FloatingStar
        className="bottom-[20%] left-[25%] w-7 h-7 opacity-20 hidden sm:block"
        delay={8}
        duration={25}
      />
      <FloatingStar
        className="bottom-[15%] right-[18%] w-9 h-9 opacity-35"
        delay={2}
        duration={20}
      />

      {/* Images */}
      {FLOATING_IMAGES.map((img, idx) => (
        <FloatingImage
          key={idx}
          src={img.src}
          className={img.className}
          style={{ top: img.top, left: img.left, right: img.right, bottom: img.bottom }}
          delay={img.delay}
          duration={img.duration}
          priority={priority}
        />
      ))}
    </>
  ) : null;

  // ===========================================================================
  // CONTENT BLOCKS
  // ===========================================================================

  const ContentBlock = (
    <div className="relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-6 md:space-y-8"
      >
        {/* Eyebrow */}
        {eyebrow ? (
          <div className="flex items-center gap-3">
            <span
              className={cn("h-px w-8 md:w-12", isLightText ? "bg-gold" : "bg-deep-brown/30")}
            />
            <p
              className={cn(
                "text-xs md:text-sm font-bold tracking-[0.2em] uppercase",
                eyebrowColor
              )}
            >
              {eyebrow}
            </p>
          </div>
        ) : null}

        {/* Title */}
        {title ? (
          <h2
            className={cn(
              "text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight font-heading",
              textColor
            )}
          >
            {title}
            {highlight ? (
              <span className={cn("block mt-2 italic font-serif", highlightColor)}>
                {highlight}
              </span>
            ) : null}
          </h2>
        ) : null}

        {/* Divider */}
        {layout === "bottom-image" || layout === "text-only" ? (
          <div className="w-20 h-1.5 bg-gold mx-auto rounded-full opacity-80" />
        ) : null}

        {/* Description or Paragraphs */}
        {paragraphs && paragraphs.length > 0 ? (
          <div
            className={cn(
              "text-lg md:text-xl leading-relaxed max-w-xl space-y-4",
              layout === "bottom-image" || layout === "text-only" ? "mx-auto" : ""
            )}
          >
            {paragraphs.map((p, i) => (
              <p key={i} className={descColor}>
                {p}
              </p>
            ))}
          </div>
        ) : description ? (
          <p
            className={cn(
              "text-lg md:text-xl leading-relaxed max-w-xl",
              layout === "bottom-image" || layout === "text-only" ? "mx-auto" : "",
              descColor
            )}
          >
            {description}
          </p>
        ) : null}

        {/* Features */}
        {features.length > 0 ? (
          <div
            className={cn(
              "pt-4",
              features.length === 6
                ? "grid grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-4 max-w-2xl w-fit"
                : "flex flex-wrap gap-x-6 gap-y-3",
              (layout === "bottom-image" || layout === "text-only") && features.length !== 6
                ? "justify-center"
                : "",
              (layout === "bottom-image" || layout === "text-only") && features.length === 6
                ? "mx-auto"
                : ""
            )}
          >
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 md:gap-3 group text-left">
                <span className="shrink-0 mt-1 flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-gold text-white shadow-[0_2px_4px_rgba(184,135,90,0.2)] transition-transform duration-300 group-hover:scale-110">
                  <svg
                    className="w-2.5 h-2.5 md:w-3 md:h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={4}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span
                  className={cn(
                    "text-[11px] sm:text-xs md:text-sm font-bold tracking-wide uppercase leading-tight pt-1",
                    isLightText ? "text-[#f5f1e8]/90!" : "text-deep-brown!"
                  )}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {/* Stats Grid */}
        {data.stats && data.stats.length > 0 ? (
          <div
            className={cn(
              "grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gold/20 mt-8",
              layout === "bottom-image" || layout === "text-only" ? "max-w-2xl mx-auto" : ""
            )}
          >
            {data.stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-1">
                <p
                  className={cn(
                    "text-3xl md:text-4xl font-bold",
                    isLightText ? textColor : "text-gold"
                  )}
                >
                  {stat.value}
                </p>
                <p
                  className={cn(
                    "text-xs md:text-sm font-bold tracking-[0.2em] uppercase",
                    descColor
                  )}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </motion.div>
    </div>
  );

  const ImageBlock = processedImageUrl ? (
    <div
      className={cn(
        "relative isolate flex justify-center",
        layout === "bottom-image" ? "mt-16 w-full max-w-5xl mx-auto" : "",
        layout === "right-image" || layout === "left-image"
          ? "w-full p-4 lg:p-12 items-center h-full max-h-full"
          : "",
        layout === "background-image" ? "absolute inset-0 z-0" : ""
      )}
    >
      <div
        className={cn(
          "relative w-full h-full overflow-visible rounded-3xl",
          layout === "right-image" || layout === "left-image" ? "min-h-75" : ""
        )}
      >
        <OptimizedImage
          src={processedImageUrl}
          alt={title || "Banner image"}
          fill={
            layout === "background-image" ||
            layout === "bottom-image" ||
            layout === "right-image" ||
            layout === "left-image"
          }
          width={
            !(
              layout === "background-image" ||
              layout === "bottom-image" ||
              layout === "right-image" ||
              layout === "left-image"
            )
              ? 800
              : undefined
          }
          height={
            !(
              layout === "background-image" ||
              layout === "bottom-image" ||
              layout === "right-image" ||
              layout === "left-image"
            )
              ? 600
              : undefined
          }
          className="transition-transform duration-1000 hover:scale-105"
          imageClassName={cn(
            "object-scale-down w-auto h-auto max-w-full rounded-3xl drop-shadow-2xl",
            layout === "right-image" || layout === "left-image" ? "object-scale-down" : ""
          )}
          priority={priority}
          sizes={layout === "background-image" ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
          quality={100}
          overflowVisible={true}
        />
      </div>
      {/* Overlay for bg image */}
      {layout === "background-image" ? (
        <div
          className={cn(
            "absolute inset-0 z-10",
            bgOverlay === "black-10" && "bg-black/10",
            bgOverlay === "black-20" && "bg-black/20",
            bgOverlay === "black-40" && "bg-black/40",
            bgOverlay === "white-10" && "bg-white/10"
          )}
        />
      ) : null}
    </div>
  ) : null;

  // ===========================================================================
  // RENDER LAYOUTS
  // ===========================================================================

  // 1. Full Background Image Layout
  if (layout === "background-image") {
    return (
      <div className={bgClasses}>
        {ImageBlock}
        {FloatingElements}
        <div className="container mx-auto px-4 md:px-8 relative z-20">{ContentBlock}</div>
      </div>
    );
  }

  // 2. Split Layouts
  if (layout === "right-image" || layout === "left-image") {
    return (
      <div className={bgClasses}>
        {FloatingElements}
        <div className="container mx-auto px-4 md:px-6 lg:px-10 h-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center h-full">
            <div
              className={cn(
                layout === "left-image" ? "order-last lg:order-first" : "order-first",
                "h-full flex flex-col justify-center"
              )}
            >
              {layout === "left-image" ? ImageBlock : ContentBlock}
            </div>
            <div
              className={cn(
                layout === "left-image" ? "order-first lg:order-last" : "order-last",
                "h-full flex flex-col justify-center"
              )}
            >
              {layout === "left-image" ? ContentBlock : ImageBlock}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Stacked/Bottom Layouts
  return (
    <div className={bgClasses}>
      {FloatingElements}
      <div className="container mx-auto px-4 md:px-6 lg:px-10 text-center">
        <div className="max-w-4xl mx-auto">{ContentBlock}</div>
        {ImageBlock}
      </div>
    </div>
  );
}
