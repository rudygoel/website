"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import "./stagger-testimonials.css";

const SQRT_5000 = Math.sqrt(5000);

export type StaggerTestimonialItem = {
  tempId: number;
  testimonial: string;
  by: string;
  imgSrc?: string | null;
};

// Fail-safe: only used if the parent forgets to pass `items`. Production
// always passes the real list from proof.ts via stagger-mount.tsx, so this
// is a single-card "system is up" placeholder, not seed content.
const FALLBACK: StaggerTestimonialItem[] = [
  {
    tempId: 0,
    testimonial:
      "Real testimonials load from src/data/proof.ts. If you're seeing this, the data import failed.",
    by: "Fallback",
    imgSrc: null,
  },
];

interface TestimonialCardProps {
  position: number;
  testimonial: StaggerTestimonialItem;
  handleMove: (steps: number) => void;
  cardSize: number;
}

function getInitials(by: string): string {
  return by
    .replace(/\[|\]/g, "")
    .split(/[ ,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/**
 * Quote font size scales inversely with character count so a long quote
 * fits the card without crashing into the byline. Tuned for the current
 * card sizes (440 desktop / 320 mobile).
 *
 *   ≤ 90 chars → base size (20 / 16)
 *   middle    → step down 1px per 40 extra chars (gentler than before)
 *   long      → floor at 14 / 12 so quotes stay legible end-to-end
 */
function quoteFontSize(quoteLen: number, cardSize: number): number {
  const base = cardSize >= 400 ? 20 : 16;
  const min = cardSize >= 400 ? 14 : 12;
  const overshoot = Math.max(0, quoteLen - 90);
  const px = base - Math.round(overshoot / 40);
  return Math.max(min, px);
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "stagger-card",
        isCenter ? "stagger-card--center" : "stagger-card--side",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath:
          "polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)",
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.6) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px var(--color-surface-1)"
          : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className="stagger-card__slash"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
        }}
      />
      {testimonial.imgSrc ? (
        <img
          src={testimonial.imgSrc}
          alt={testimonial.by.split(",")[0]}
          className="stagger-card__avatar"
        />
      ) : (
        <span
          className="stagger-card__avatar stagger-card__avatar--placeholder"
          aria-hidden="true"
        >
          {getInitials(testimonial.by)}
        </span>
      )}
      <h3
        className="stagger-card__quote"
        style={{
          fontSize: `${quoteFontSize(testimonial.testimonial.length, cardSize)}px`,
        }}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>
      <p className="stagger-card__by">{testimonial.by}</p>
    </div>
  );
};

export interface StaggerTestimonialsProps {
  items?: StaggerTestimonialItem[];
}

export const StaggerTestimonials: React.FC<StaggerTestimonialsProps> = ({
  items,
}) => {
  const initial = items && items.length > 0 ? items : FALLBACK;
  const [cardSize, setCardSize] = useState(360);
  const [list, setList] = useState<StaggerTestimonialItem[]>(initial);

  const handleMove = (steps: number) => {
    const next = [...list];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = next.shift();
        if (!item) return;
        next.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = next.pop();
        if (!item) return;
        next.unshift({ ...item, tempId: Math.random() });
      }
    }
    setList(next);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 400 : 300);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="stagger-stage" style={{ height: 660 }}>
      {list.map((t, index) => {
        // Symmetric centering: 5 cards → -2, -1, 0, +1, +2. The earlier
        // `(length + 1) / 2` made odd lists lean left, pushing the first
        // card off-screen when the stack got bigger.
        const position =
          list.length % 2
            ? index - Math.floor(list.length / 2)
            : index - list.length / 2;
        return (
          <TestimonialCard
            key={t.tempId}
            position={position}
            testimonial={t}
            handleMove={handleMove}
            cardSize={cardSize}
          />
        );
      })}
      <div className="stagger-controls">
        <button
          onClick={() => handleMove(-1)}
          className="stagger-btn"
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className="stagger-btn"
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
