"use client";

/**
 * Product Showcase Section Component
 *
 * Displays a grid of products with modal for specs and enquiry functionality.
 * Uses useState for modal state - requires client component.
 *
 * All content is passed via props from parent components that fetch from Sanity CMS.
 * Data is validated with Zod schemas for runtime type safety.
 */

import { useState, useCallback, useSyncExternalStore, memo } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Package } from "lucide-react";

import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import DecorativeBackground from "@/components/ui/DecorativeBackground";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalized, type LocaleString, type LocaleText } from "@/lib/i18n";
import type { SanityImageSource } from "@sanity/image-url";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface Product {
  _id: string;
  title: LocaleString;
  category: string;
  slug?: { current?: string };
  heroHeading?: LocaleString;
  introParagraphs?: LocaleText[];
  listSections?: { title: LocaleString; items: LocaleString[] }[];
  ctaLine?: LocaleString;
  description?: LocaleText;
  heroImage?: SanityImageSource;
}

interface HeaderData {
  eyebrow?: string | LocaleString;
  title?: string | LocaleString;
  description?: string | LocaleText;
}

interface ProductShowcaseProps {
  initialProducts?: Product[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  siteSettings?: any;
  headerData?: HeaderData;
}

// =============================================================================
// ZOD VALIDATION SCHEMAS (for runtime validation)
// =============================================================================

const ProductSchema = z.object({
  _id: z.string(),
  title: z.unknown(),
  category: z.string(),
  slug: z.object({ current: z.string().optional() }).optional(),
  heroHeading: z.unknown().optional(),
  introParagraphs: z.array(z.unknown()).optional(),
  listSections: z.array(z.unknown()).optional(),
  ctaLine: z.unknown().optional(),
  description: z.unknown().optional(),
  heroImage: z.unknown().optional(),
});

const HeaderDataSchema = z.object({
  eyebrow: z.unknown().optional(),
  title: z.unknown().optional(),
  description: z.unknown().optional(),
});

const ProductShowcasePropsSchema = z.object({
  initialProducts: z.array(ProductSchema).optional(),
  siteSettings: z.unknown().optional(),
  headerData: HeaderDataSchema.optional(),
});

// =============================================================================
// VALIDATION
// =============================================================================

function validateProps(props: unknown): void {
  const result = ProductShowcasePropsSchema.safeParse(props);
  if (!result.success) {
    console.warn("[ProductShowcase] Props validation warning:", result.error.format());
  }
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06, // Standard fast stagger
      delayChildren: 0.05,
      ease: "easeOut" as const,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4, // Snappier
      ease: "easeOut" as const,
    },
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProductShowcase({
  initialProducts,
  siteSettings,
  headerData,
}: ProductShowcaseProps) {
  // Hydration-safe client detection using useSyncExternalStore (React 18 pattern)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Validate props in development
  if (process.env.NODE_ENV === "development") {
    validateProps({ initialProducts, siteSettings, headerData });
  }

  const products = initialProducts ?? [];
  const [selectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sectionId = siteSettings?.routing?.productsSectionId as string | undefined;
  const analyticsEventName = siteSettings?.analytics?.eventAddToEnquiry as string | undefined;

  const handleAddToEnquiry = useCallback(
    (product: Product) => {
      if (typeof window !== "undefined" && analyticsEventName) {
        const event = new CustomEvent(analyticsEventName, { detail: product });
        window.dispatchEvent(event);
      }
    },
    [analyticsEventName]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleModalAddToEnquiry = useCallback(() => {
    if (selectedProduct) {
      handleAddToEnquiry(selectedProduct);
    }
  }, [selectedProduct, handleAddToEnquiry]);

  if (products.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="py-10 md:py-16 bg-bg relative"
      aria-labelledby="products-heading"
    >
      {/* Floating Dry Fruits Decorations */}
      <DecorativeBackground variant="scattered" />

      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        {headerData ? <SectionHeader headerData={headerData} /> : null}

        {/* Products Grid - Render only after hydration to prevent mobile SSR mismatch */}
        {mounted ? (
          <ProductsGrid
            products={products}
            siteSettings={siteSettings}
            onAddToEnquiry={handleAddToEnquiry}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {products.slice(0, 3).map((p) => (
              <div key={p._id} className="bg-sand/30 rounded-3xl h-[400px] animate-pulse" />
            ))}
          </div>
        )}

        {/* Product Modal - Render only after hydration */}
        {mounted ? (
          <ProductModal
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onAddToEnquiry={handleModalAddToEnquiry}
            labels={siteSettings}
          />
        ) : null}
      </div>
    </section>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface SectionHeaderProps {
  headerData: HeaderData;
}

const SectionHeader = memo(function SectionHeader({ headerData }: SectionHeaderProps) {
  const { language } = useLanguage();
  return (
    <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto">
      {/* Icon */}
      <motion.div
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-gold mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Package className="w-8 h-8" />
      </motion.div>

      {headerData.eyebrow ? (
        <motion.div
          className="flex items-center justify-center gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="h-px w-8 bg-gold" />
          <span className="uppercase tracking-[0.3em] text-sm text-gold-dark font-semibold">
            {getLocalized(headerData.eyebrow, language)}
          </span>
          <span className="h-px w-8 bg-gold" />
        </motion.div>
      ) : null}

      {headerData.title ? (
        <motion.h2
          id="products-heading"
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-brown mb-6 font-heading leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {getLocalized(headerData.title, language)}
        </motion.h2>
      ) : null}

      {headerData.description ? (
        <motion.p
          className="text-lg text-text-muted leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {getLocalized(headerData.description, language)}
        </motion.p>
      ) : null}
    </div>
  );
});

interface ProductsGridProps {
  products: Product[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  siteSettings: any;
  onAddToEnquiry: (product: Product) => void;
}

function ProductsGrid({ products, siteSettings, onAddToEnquiry }: ProductsGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
      initial="show"
      animate="show"
      variants={staggerContainer}
    >
      {products.map((product) => (
        <motion.div key={product._id} variants={fadeInUp} initial="show" animate="show">
          <ProductCard
            product={product}
            onAddToEnquiry={() => onAddToEnquiry(product)}
            labels={siteSettings}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
