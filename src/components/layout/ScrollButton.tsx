"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { smoothScrollToSection } from "@/lib/smooth-scroll";

interface ScrollButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  sectionId: string;
  offset?: number;
}

export function ScrollButton({ children, sectionId, offset, onClick, ...props }: ScrollButtonProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        smoothScrollToSection(sectionId, offset, event);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
