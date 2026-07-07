"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ScrollButton } from "@/components/layout/ScrollButton";
import { CONTACT_SECTION_ID, CONTACT_SCROLL_OFFSET } from "@/lib/smooth-scroll";

interface ContactScrollButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function ContactScrollButton({ children, ...props }: ContactScrollButtonProps) {
  return (
    <ScrollButton sectionId={CONTACT_SECTION_ID} offset={CONTACT_SCROLL_OFFSET} {...props}>
      {children}
    </ScrollButton>
  );
}
