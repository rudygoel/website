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

const FALLBACK: StaggerTestimonialItem[] = [
  { tempId: 0, testimonial: "Hired Rudy after our welcome sequence converted at 0%. Three weeks later it's pulling 28%. He just gets the voice on draft one, every time.", by: "[CLIENT NAME], Performance Coach", imgSrc: null },
  { tempId: 1, testimonial: "The first broadcast Rudy sent under my name made $11K. I'm not rounding up. He moves my list like nobody else has.", by: "[CLIENT NAME], Mindset Coach", imgSrc: null },
  { tempId: 2, testimonial: "I've worked with five copywriters. Rudy is the only one who got me on draft one. Saves me an hour a week, easy.", by: "[CLIENT NAME], High-performance Coach", imgSrc: null },
  { tempId: 3, testimonial: "Rudy doesn't just write. He thinks. The strategy calls alone are worth the retainer. The emails are a bonus.", by: "[CLIENT NAME], Founder", imgSrc: null },
  { tempId: 4, testimonial: "Best decision we made this year was bringing Rudy on for our launch sequence. List has never been hotter.", by: "[CLIENT NAME], Course Creator", imgSrc: null },
  { tempId: 5, testimonial: "Replies started coming in the same day. Real ones, from real readers. That's the difference Rudy makes.", by: "[CLIENT NAME], Coach", imgSrc: null },
  { tempId: 6, testimonial: "Rudy has provided me with more than I could ever ask for. He exceeded my expectations and has become a guiding force for my business and its messaging.", by: "Joel Edgley, Owner at FINEDGE Media", imgSrc: null },
  { tempId: 7, testimonial: "If you want someone who can deliver great copy and drive revenue for your business, plus elevate your own writing skills in the process, Rudy's your guy.", by: "Jose Williams, Copywriter", imgSrc: null },
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
 * card sizes (360 desktop / 280 mobile).
 *
 *   ≤ 70 chars → base size (20 / 16)
 *   middle    → step down 1px per 25 extra chars
 *   ≥ ~330 chars → min size (11 / 9), the rest clips with overflow:hidden
 */
function quoteFontSize(quoteLen: number, cardSize: number): number {
  const base = cardSize >= 340 ? 20 : 16;
  const min = cardSize >= 340 ? 11 : 9;
  const overshoot = Math.max(0, quoteLen - 70);
  const px = base - Math.round(overshoot / 25);
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
          translateX(${(cardSize / 1.5) * position}px)
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
      setCardSize(matches ? 360 : 280);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="stagger-stage" style={{ height: 600 }}>
      {list.map((t, index) => {
        const position =
          list.length % 2
            ? index - (list.length + 1) / 2
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
