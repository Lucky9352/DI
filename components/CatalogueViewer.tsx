"use client";

/**
 * Catalogue Viewer Component
 */

import React, { useState, useRef, useCallback, useEffect, forwardRef } from "react";
import _Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { cn, getGoogleDriveImageUrl } from "@/lib/utils";
import DecorativeBackground from "@/components/ui/DecorativeBackground";
import type { Product } from "@/sanity.types";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-almond-gold" />
    </div>
  ),
});

interface FlipBookInstance {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
  };
}

export interface CatalogueViewerProps {
  products: Product[];
}

interface ProductPageProps {
  product: Product;
  type: "cover" | "intro" | "specs" | "gallery" | "end";
  pageNumber: number;
  showPageNumbers?: boolean;
}

const catalogueImages: Record<string, string> = {
  almonds: "/catalogue-almonds.png",
  cashews: "/catalogue-cashews.png",
  walnuts: "/catalogue-walnuts.png",
  pistachio: "/catalogue-pistachios.png",
  coconut: "/catalogue-coconut.png",
  raisins: "/catalogue-raisins.png",
};

function getCatalogueImage(product: Product): string {
  const category = product.category?.toLowerCase() || "";
  return catalogueImages[category] || getGoogleDriveImageUrl(product.heroImageUrl || "") || "";
}

const ProductPage = forwardRef<HTMLDivElement, ProductPageProps>(
  ({ product, type, pageNumber, showPageNumbers }, ref) => {
    if (type === "cover") {
      return (
        <div
          ref={ref}
          className="page-wrapper bg-linear-to-br from-deep-brown to-black text-white p-8 md:p-12 flex flex-col justify-between"
          style={{ width: "100%", height: "100%" }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="w-48 h-48 md:w-64 md:h-64 relative rounded-full overflow-hidden border-4 border-almond-gold/50 shadow-2xl">
              {product.heroImageUrl ? (
                <OptimizedImage
                  src={product.heroImageUrl}
                  alt={product.title?.en || "Cover"}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold font-heading text-almond-gold mb-4">
                {product.title?.en}
              </h1>
              <p className="text-white/80 text-lg max-w-md mx-auto">{product.heroHeading?.en}</p>
            </div>
          </div>
          <div className="text-center border-t border-white/10 pt-6">
            <p className="text-sm tracking-widest uppercase text-almond-gold">
              Divyansh International Collection
            </p>
          </div>
        </div>
      );
    }

    if (type === "intro") {
      return (
        <div
          ref={ref}
          className="page-wrapper bg-[#FAF6F1] p-8 md:p-10 flex flex-col h-full relative overflow-hidden"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage: "url('/catalogue-page-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Subtle border */}
          <div className="absolute inset-3 border border-[#D4C4A8] pointer-events-none z-10" />
          {/* Product Image - natural size like ProductCard */}
          <div className="relative z-10 w-full flex justify-center mb-4 overflow-visible">
            <OptimizedImage
              src={getCatalogueImage(product)}
              alt={product.title?.en || "Product"}
              width={400}
              height={300}
              quality={100}
              overflowVisible
              className="w-auto h-auto max-w-[90%] mx-auto block rounded-lg shadow-md border border-[#D4C4A8]"
              imageClassName="object-contain"
            />
          </div>

          <h2 className="relative z-10 text-2xl font-bold text-[#3A2A1E] font-heading mb-3">
            {product.title?.en}
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
            <div className="prose prose-sm prose-brown">
              {product.introParagraphs?.slice(0, 2).map((para, idx) => (
                <p key={idx} className="mb-3 text-[#5C4A3A] leading-relaxed text-sm">
                  {para.en}
                </p>
              ))}
            </div>
          </div>

          {showPageNumbers ? (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-[#6B5B4F] font-semibold z-10 bg-[#FAF6F1]/80 px-3 py-1 rounded-full">
              {pageNumber}
            </div>
          ) : null}
        </div>
      );
    }

    if (type === "specs") {
      return (
        <div
          ref={ref}
          className="page-wrapper bg-[#F5EFE6] p-8 md:p-10 flex flex-col h-full relative overflow-hidden"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage: "url('/catalogue-page-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Subtle border */}
          <div className="absolute inset-3 border border-[#D4C4A8] pointer-events-none z-10" />
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
            <h3 className="text-xl font-bold text-[#3A2A1E] mb-4 border-b border-[#C4A35A]/40 pb-2">
              Specifications
            </h3>

            <dl className="grid grid-cols-1 gap-y-3 mb-6 text-sm">
              {product.specifications?.origin ? (
                <div className="grid grid-cols-3">
                  <dt className="font-semibold text-[#6B5B4F]">Origin</dt>
                  <dd className="col-span-2 text-[#3A2A1E]">{product.specifications.origin}</dd>
                </div>
              ) : null}
              {product.specifications?.packaging ? (
                <div className="grid grid-cols-3">
                  <dt className="font-semibold text-[#6B5B4F]">Packaging</dt>
                  <dd className="col-span-2 text-[#3A2A1E]">{product.specifications.packaging}</dd>
                </div>
              ) : null}
              {product.specifications?.logistics ? (
                <div className="grid grid-cols-3">
                  <dt className="font-semibold text-[#6B5B4F]">Logistics</dt>
                  <dd className="col-span-2 text-[#3A2A1E]">{product.specifications.logistics}</dd>
                </div>
              ) : null}
            </dl>

            <div className="space-y-4">
              {product.listSections?.slice(0, 2).map((section) => (
                <div
                  key={section._key}
                  className="bg-[#FAF6F1] p-3 rounded-lg border border-[#D4C4A8]"
                >
                  <h4 className="font-bold text-[#3A2A1E] mb-1.5 text-xs uppercase tracking-wide">
                    {section.title?.en}
                  </h4>
                  <ul className="list-disc list-inside space-y-0.5">
                    {section.items?.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="text-xs text-[#5C4A3A] pl-1">
                        <span className="text-[#3A2A1E]/80">{item.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {product.ctaLine?.en ? (
              <div className="relative z-10 mt-6 p-4 bg-[#FAF6F1] rounded-lg border border-[#C4A35A]/30 shadow-sm">
                <p className="text-[#3A2A1E] font-medium italic text-sm">
                  &quot;{product.ctaLine.en}&quot;
                </p>
              </div>
            ) : null}
          </div>

          {showPageNumbers ? (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-[#6B5B4F] font-semibold z-10 bg-[#F5EFE6]/80 px-3 py-1 rounded-full">
              {pageNumber}
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div ref={ref} className="bg-white p-10">
        <p>Page Content</p>
      </div>
    );
  }
);
ProductPage.displayName = "ProductPage";

const CoverPage = forwardRef<HTMLDivElement, { title: string; subtitle?: string }>(
  ({ title, subtitle }, ref) => (
    <div
      ref={ref}
      className="page-wrapper bg-[#E8DDD0] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {/* Background image with dry fruits */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/catalogue-cover-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Double border */}
      <div className="absolute inset-4 border border-[#A69070] pointer-events-none z-10" />
      <div className="absolute inset-6 border border-[#C4B090] pointer-events-none z-10" />

      {/* Content wrapper with z-index */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <OptimizedImage
            src="/Logo.png"
            alt="Divyansh International Logo"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>

        {/* Elegant centered separator */}
        <div className="flex items-center justify-center gap-4 my-2 w-full">
          <div className="w-12 h-px bg-[#A69070]" />
          <div className="w-2 h-2 rotate-45 border border-[#8B7355]" />
          <div className="w-12 h-px bg-[#A69070]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold font-heading tracking-wide mb-1 text-[#3A2A1E]">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle ? (
          <p className="text-xs text-[#5C4A3A] font-medium tracking-[0.2em] uppercase mb-2">
            {subtitle}
          </p>
        ) : null}

        {/* Tagline */}
        <p className="text-[11px] text-[#4A3C30] italic">
          Bringing Nature&apos;s Finest to Your Table
        </p>

        {/* Quality badges */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="text-[9px] text-[#5C4A3A] uppercase tracking-wider px-3 py-1.5 bg-[#D4C4A8] rounded">
            Premium Quality
          </span>
          <span className="text-[9px] text-[#5C4A3A] uppercase tracking-wider px-3 py-1.5 bg-[#D4C4A8] rounded">
            Export Grade
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-center z-10">
        <p className="text-sm text-[#3A2A1E] uppercase tracking-[0.05em] font-bold">
          Divyansh International Pvt Ltd · Ludhiana, Punjab
        </p>
        <p className="text-[10px] text-[#8B7355] mt-1">Est. 1999 · Catalogue 2026</p>
      </div>
    </div>
  )
);
CoverPage.displayName = "CoverPage";

export default function CatalogueViewer({ products }: CatalogueViewerProps) {
  const flipBookRef = useRef<FlipBookInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [visualPage, setVisualPage] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFlipping, setIsFlipping] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [_isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 500, height: 700 });

  const totalPages = products.length * 2 + 4;

  useEffect(() => {
    const updateDimensions = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        const width = Math.min(window.innerWidth - 32, 400);
        setDimensions({ width, height: Math.round(width * 1.414) });
      } else {
        setDimensions({ width: 500, height: 700 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const flipBook = flipBookRef.current;
      if (!flipBook) return;

      if (e.key === "ArrowRight") {
        setFlipDirection("next");
        flipBook.pageFlip().flipNext();
      } else if (e.key === "ArrowLeft") {
        setFlipDirection("prev");
        flipBook.pageFlip().flipPrev();
      } else if (e.key === "Escape" && isFullscreen) {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisualPage(currentPage);
    }, 5);

    return () => clearTimeout(timer);
  }, [currentPage]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  const handleFlipStateChange = useCallback((e: { data: string }) => {
    if (e.data === "flipping") {
      setIsFlipping(true);
    } else if (e.data === "read") {
      setIsFlipping(false);
    }
  }, []);

  const flipNext = () => {
    setFlipDirection("next");
    flipBookRef.current?.pageFlip()?.flipNext();
  };
  const flipPrev = () => {
    setFlipDirection("prev");
    flipBookRef.current?.pageFlip()?.flipPrev();
  };

  // if (isMobile) {
  //   return (
  //     <div className="min-h-screen bg-sand/20 flex flex-col items-center justify-start p-6 pt-32 pb-12 text-center overflow-y-auto">
  //       <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gold/20 flex flex-col items-center">
  //         <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6">
  //           <svg
  //             className="w-10 h-10 text-gold"
  //             fill="none"
  //             stroke="currentColor"
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth={1.5}
  //               d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
  //             />
  //           </svg>
  //         </div>
  //         <h2 className="text-2xl font-bold text-deep-brown mb-4 font-heading">
  //           Desktop Experience Only
  //         </h2>
  //         <p className="text-text-light mb-8 italic">
  //           Our interactive product catalogue is designed for larger screens to provide the best
  //           reading experience. Please switch to a larger screen to view it.
  //         </p>
  //         <div className="w-full mt-2">
  //           <Link
  //             href="/"
  //             className="inline-block bg-gold hover:bg-gold-dark text-white px-10 py-3.5 rounded-full font-bold transition-all shadow-md active:scale-95"
  //           >
  //             Back To Home
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No products available for catalogue.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand/20 pt-32 pb-20 flex flex-col items-center relative overflow-hidden">
      {/* Background Decorative Elements */}
      <DecorativeBackground variant="scattered" className="opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 px-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-deep-brown mb-2 font-heading">
          Product Catalogue
        </h1>
        <p className="text-lg text-text-light max-w-2xl mx-auto">
          Explore Our Premium Collection Of Dry Fruits.
        </p>
      </motion.div>

      <div className="flex justify-center mb-8">
        <button
          onClick={toggleFullscreen}
          className="group bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 text-deep-brown border border-gold-light/30"
          title="Fullscreen Mode"
        >
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>
      </div>

      <div
        ref={containerRef}
        className={cn(
          "relative flex items-center justify-center p-4 transition-all duration-300",
          isFullscreen ? "bg-black" : ""
        )}
        style={{
          width: isFullscreen ? "100%" : "auto",
          height: isFullscreen ? "100%" : "auto",
        }}
      >
        <button
          onClick={flipPrev}
          className="absolute left-2 md:left-8 z-20 bg-white/80 p-3 rounded-full text-deep-brown shadow-lg hover:bg-white transition-all disabled:opacity-50 md:hidden"
          disabled={currentPage === 0}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={flipNext}
          className="absolute right-2 md:right-8 z-20 bg-white/80 p-3 rounded-full text-deep-brown shadow-lg hover:bg-white transition-all disabled:opacity-50 md:hidden"
          disabled={currentPage >= totalPages - 1}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          className={cn(
            "rounded-sm transition-all duration-500 ease-in-out",
            "bg-transparent shadow-none"
          )}
          style={{
            transform: !isMobile
              ? visualPage <= 1
                ? "translateX(-25%)"
                : visualPage >= totalPages - 2
                  ? "translateX(25%)"
                  : "none"
              : "none",
          }}
        >
          <HTMLFlipBook
            ref={flipBookRef}
            width={dimensions.width}
            height={dimensions.height}
            size="fixed"
            minWidth={300}
            maxWidth={600}
            minHeight={400}
            maxHeight={800}
            maxShadowOpacity={0.5}
            showCover={false}
            mobileScrollSupport={true}
            className="catalogue-book"
            style={{}}
            startPage={0}
            drawShadow={false}
            flippingTime={1500}
            usePortrait={isMobile}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
            onFlip={handleFlip}
            onChangeState={handleFlipStateChange}
            onInit={() => setIsLoading(false)}
          >
            <div
              className={cn("page-wrapper relative", isFullscreen ? "bg-black" : "bg-background")}
              style={{ width: "100%", height: "100%" }}
            >
              {!isFullscreen ? <div className="absolute inset-0 bg-sand/20" /> : null}
            </div>
            <CoverPage title="Product Catalogue" subtitle="Premium Dry Fruits & Nuts" />

            {products
              .map((product, index) => (
                <div key={`wrapper-${product._id}`}>
                  <div className="hidden"></div>
                  <ProductPage
                    product={product}
                    type="intro"
                    pageNumber={index * 2 + 1}
                    showPageNumbers={true}
                    key={`${product._id}-intro`}
                  />
                  <ProductPage
                    product={product}
                    type="specs"
                    pageNumber={index * 2 + 2}
                    showPageNumbers={true}
                    key={`${product._id}-specs`}
                  />
                </div>
              ))
              .flatMap((x) => [x.props.children[1], x.props.children[2]])}

            <div
              className="page-wrapper bg-[#E8DDD0] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl"
              style={{ width: "100%", height: "100%" }}
            >
              {/* Background image with dry fruits */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "url('/catalogue-cover-bg.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Double border */}
              <div className="absolute inset-4 border border-[#A69070] pointer-events-none z-10" />
              <div className="absolute inset-6 border border-[#C4B090] pointer-events-none z-10" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                {/* Logo */}
                <div className="flex items-center justify-center">
                  <OptimizedImage
                    src="/Logo.png"
                    alt="Divyansh International Logo"
                    width={500}
                    height={500}
                    className="object-contain"
                  />
                </div>

                {/* Tagline */}
                <p className="text-lg text-[#3A2A1E] font-semibold mt-8 mb-2">
                  Bringing Nature&apos;s Finest to You
                </p>

                {/* Website */}
                <p className="text-lg text-[#3A2A1E] font-semibold tracking-wide">
                  www.divyanshint.com
                </p>
              </div>

              {/* Footer */}
              <div className="absolute bottom-26 left-1/2 -translate-x-1/2 text-center z-10">
                <p className="text-base text-[#3A2A1E] uppercase tracking-[0.08em] font-bold">
                  Thank You for Choosing Us
                </p>
                <p className="text-xs text-[#6B5B4F] mt-1 font-medium">
                  Quality · Trust · Excellence
                </p>
              </div>
            </div>

            <div
              className={cn("page-wrapper relative", isFullscreen ? "bg-black" : "bg-background")}
              style={{ width: "100%", height: "100%" }}
            >
              {!isFullscreen ? <div className="absolute inset-0 bg-sand/20" /> : null}
            </div>
          </HTMLFlipBook>
        </div>
      </div>

      <div className="mt-8 text-center text- text-text-muted md:hidden">
        Page {currentPage + 1} of {totalPages}
      </div>
    </div>
  );
}
