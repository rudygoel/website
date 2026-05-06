/**
 * stagger-mount.tsx — mounts the React StaggerTestimonials component into
 * a vanilla DOM placeholder. Pulls the real testimonials from data/proof
 * and merges with placeholder ones authored inside the component.
 */

import React from "react";
import { createRoot } from "react-dom/client";
import {
  StaggerTestimonials,
  type StaggerTestimonialItem,
} from "@/components/ui/stagger-testimonials";
import { testimonials, type WrittenTestimonial } from "../data/proof";

function toItem(t: WrittenTestimonial, i: number): StaggerTestimonialItem {
  const meta = [t.role, t.business].filter(Boolean).join(" at ");
  const by = meta ? `${t.name}, ${meta}` : t.name;
  return {
    tempId: i,
    testimonial: t.quote,
    by,
    imgSrc: t.avatar ?? null,
  };
}

export function mountStagger(): void {
  const target = document.getElementById("stagger-mount");
  if (!target) return;
  const written = testimonials
    .filter((t): t is WrittenTestimonial => t.type === "written")
    .map(toItem);
  const root = createRoot(target);
  root.render(
    <React.StrictMode>
      <StaggerTestimonials items={written} />
    </React.StrictMode>,
  );
}
