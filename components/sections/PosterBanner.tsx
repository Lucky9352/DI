"use client";

/**
 * Poster Banner Section Component
 *
 * Full-width banner for displaying a single promotional poster.
 * Used on the home page between Hero and SpiralQuote sections.
 * Supports Google Drive URLs with automatic transformation.
 */

import { motion } from "framer-motion";
import { getGoogleDriveImageUrl } from "@/lib/utils";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface PosterBannerProps {
  bannerData?: {
    imageUrl?: string;
    alt?: string;
    title?: string;
  } | null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function PosterBanner({ bannerData }: PosterBannerProps) {
  // Don't render if no image URL
  if (!bannerData?.imageUrl) return null;

  // Transform Google Drive URL if needed
  const imageUrl = getGoogleDriveImageUrl(bannerData.imageUrl);

  // If transformation returns null, don't render
  if (!imageUrl) return null;

  return (
    <section
      className="relative w-full py-8 md:py-12 lg:py-16 bg-bg overflow-hidden"
      aria-label="Featured poster"
    >
      {/* Container with max width for proper sizing */}
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <motion.div
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Poster Image - using img tag like ProductCard for Google Drive URLs */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={bannerData.alt ?? "Divyansh International promotional poster"}
            className="w-full h-auto block rounded-2xl"
          />

          {/* Optional Title Overlay */}
          {bannerData.title ? (
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-deep-brown/80 to-transparent p-6 md:p-8">
              <motion.h3
                className="text-xl md:text-2xl lg:text-3xl font-bold text-white font-heading"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {bannerData.title}
              </motion.h3>
            </div>
          ) : null}

          {/* Decorative border */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-gold/20 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
