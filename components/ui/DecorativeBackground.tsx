"use client";

import { motion } from "framer-motion";
import { useState, useSyncExternalStore, memo } from "react";
import {
  LeafIcon,
  NutIcon,
  AlmondIcon,
  CashewIcon,
  WalnutIcon,
  PeanutIcon,
} from "@/components/assets/Decorations";

export type Variant = "default" | "scattered" | "side-balanced" | "minimal";

export interface DecorativeBackgroundProps {
  variant?: Variant;
  className?: string;
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function GoldenDust() {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Generate a fixed set of particles to avoid hydration mismatch on initial render
  // In a real generic random scenario, we'd seed this.
  // We use useState with an initializer to ensure they are stable across re-renders.
  const [particles] = useState(() =>
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1, // 1px to 4px
      duration: Math.random() * 10 + 10, // 10s to 20s
      delay: Math.random() * 5,
    }))
  );

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/30 blur-[1px]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  xRange?: number[];
  yRange?: number[];
  rotateRange?: number[];
}

function FloatingElement({
  children,
  className = "",
  delay = 0,
  duration = 15,
  xRange = [0, 10, 0],
  yRange = [0, -15, 0],
  rotateRange = [0, 5, -5, 0],
}: FloatingElementProps) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        x: xRange,
        y: yRange,
        rotate: rotateRange,
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default memo(function DecorativeBackground({
  variant = "default",
  className = "",
}: DecorativeBackgroundProps) {
  const renderDefault = () => (
    <>
      <FloatingElement
        className="top-10 left-0 text-gold/5" // Use text-color for SVGs using currentColor
        duration={18}
        yRange={[0, -20, 0]}
        rotateRange={[0, 2, -2, 0]}
      >
        <LeafIcon className="w-80 h-80" />
      </FloatingElement>

      <FloatingElement
        className="top-1/4 right-16 opacity-15"
        duration={20}
        rotateRange={[0, 15, -15, 0]}
        yRange={[0, -25, 0]}
      >
        <AlmondIcon className="w-28 h-28" />
      </FloatingElement>

      <FloatingElement
        className="bottom-1/3 left-20 opacity-15"
        duration={22}
        rotateRange={[0, -14, 14, 0]}
        xRange={[0, -15, 0]}
        delay={2}
      >
        <AlmondIcon className="w-32 h-32" />
      </FloatingElement>

      <FloatingElement
        className="top-1/3 left-1/4 opacity-15"
        duration={25}
        rotateRange={[0, -9, 9, 0]}
        yRange={[0, -15, 0]}
        delay={1}
      >
        <WalnutIcon className="w-26 h-26" />
      </FloatingElement>

      <FloatingElement
        className="bottom-1/3 left-1/3 opacity-15"
        duration={28}
        rotateRange={[0, 11, -11, 0]}
        xRange={[0, 12, 0]}
        delay={4}
      >
        <PeanutIcon className="w-22 h-22" />
      </FloatingElement>
    </>
  );

  const renderScattered = () => (
    <>
      {/* Large background anchor */}
      <FloatingElement
        className="top-[-5%] right-1/4 text-deep-brown/5"
        duration={30}
        yRange={[0, 20, 0]}
        rotateRange={[0, 5, 0]}
      >
        <NutIcon className="w-96 h-96" />
      </FloatingElement>

      {/* Scattered particles */}
      <FloatingElement
        className="top-[15%] left-[10%] opacity-15"
        duration={18}
        rotateRange={[0, 45, 0]}
        xRange={[0, 20, 0]}
      >
        <CashewIcon className="w-20 h-20" />
      </FloatingElement>

      <FloatingElement
        className="top-[45%] right-[8%] opacity-10"
        duration={25}
        rotateRange={[0, -30, 30, 0]}
        yRange={[0, 40, 0]}
        delay={1}
      >
        <WalnutIcon className="w-32 h-32" />
      </FloatingElement>

      <FloatingElement
        className="bottom-[25%] left-[15%] opacity-12"
        duration={22}
        rotateRange={[0, 60, 0]}
        delay={2}
      >
        <AlmondIcon className="w-24 h-24" />
      </FloatingElement>

      <FloatingElement
        className="bottom-[10%] right-[30%] opacity-8"
        duration={35}
        rotateRange={[0, -360]}
        delay={0.5}
      >
        <PeanutIcon className="w-20 h-20" />
      </FloatingElement>

      <FloatingElement
        className="top-[30%] left-[80%] opacity-12"
        duration={28}
        rotateRange={[0, 15, -15, 0]}
        yRange={[0, -20, 0]}
        delay={3}
      >
        <AlmondIcon className="w-16 h-16" />
      </FloatingElement>
    </>
  );

  const renderSideBalanced = () => (
    <>
      <FloatingElement
        className="top-20 right-0 text-gold/5"
        duration={25}
        xRange={[0, 10, 0]}
        rotateRange={[0, -5, 0]}
      >
        <LeafIcon className="w-80 h-80 transform scale-x-[-1]" />
      </FloatingElement>

      <FloatingElement
        className="top-[25%] left-[5%] opacity-15"
        duration={22}
        yRange={[0, -20, 0]}
        rotateRange={[0, 15, 0]}
      >
        <WalnutIcon className="w-24 h-24" />
      </FloatingElement>

      <FloatingElement
        className="top-[65%] left-[8%] opacity-12"
        duration={26}
        yRange={[0, 25, 0]}
        rotateRange={[0, -10, 0]}
        delay={1}
      >
        <CashewIcon className="w-28 h-28" />
      </FloatingElement>

      <FloatingElement
        className="bottom-[15%] right-[5%] opacity-15"
        duration={28}
        xRange={[0, -15, 0]}
        rotateRange={[0, 20, 0]}
        delay={2}
      >
        <AlmondIcon className="w-26 h-26" />
      </FloatingElement>
    </>
  );

  const renderMinimal = () => (
    <>
      <FloatingElement
        className="-top-10 -right-10 opacity-10"
        duration={30}
        rotateRange={[0, 10, -10, 0]}
      >
        <NutIcon className="w-56 h-56" />
      </FloatingElement>

      <FloatingElement
        className="bottom-10 left-10 opacity-10"
        duration={35}
        rotateRange={[0, -8, 8, 0]}
        yRange={[0, 15, 0]}
      >
        <LeafIcon className="w-48 h-48" />
      </FloatingElement>

      {/* Subtle extra detail for minimal */}
      <FloatingElement
        className="top-1/2 left-10 opacity-5"
        duration={25}
        rotateRange={[0, 360]}
        delay={5}
      >
        <AlmondIcon className="w-12 h-12" />
      </FloatingElement>
    </>
  );

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      {/* Background ambient dust for all variants */}
      <GoldenDust />

      <div className="relative z-10 w-full h-full">
        {variant === "default" ? renderDefault() : null}
        {variant === "scattered" ? renderScattered() : null}
        {variant === "side-balanced" ? renderSideBalanced() : null}
        {variant === "minimal" ? renderMinimal() : null}
      </div>
    </div>
  );
});
