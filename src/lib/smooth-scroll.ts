import type { KeyboardEvent, MouseEvent } from "react";

export const CONTACT_SECTION_ID = "contact";
export const CONTACT_SCROLL_OFFSET = 96;

export function smoothScrollToSection(
    sectionId: string,
    offset = 96,
    event?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement> | null,
) {
    if (event) {
        event.preventDefault();
    }

    if (typeof window === "undefined") {
        return;
    }

    const target = document.getElementById(sectionId);

    if (!target) {
        return;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
        top,
        behavior: "smooth",
    });

    const url = new URL(window.location.href);
    url.hash = sectionId;
    window.history.pushState({}, "", url.toString());
}

export function smoothScrollToContact(
    event?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement> | null,
) {
    smoothScrollToSection(CONTACT_SECTION_ID, CONTACT_SCROLL_OFFSET, event);
}
