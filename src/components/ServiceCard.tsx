"use client";

import { useEffect, useRef, useState } from "react";
import { getServiceIcon } from "@/lib/service-icons";
import type { Service } from "@/types/service";
import { MessageCircle } from "lucide-react";

interface ServiceCardProps {
  service: Service;
  phone?: string;
}

export default function ServiceCard({ service, phone }: ServiceCardProps) {
  const { icon: Icon, color } = getServiceIcon(service.icon);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    let timeout: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      setIsScrolling(true);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 250);
    };

    element.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      element.removeEventListener("scroll", onScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const waNumber = (phone || "").replace(/\D/g, "").replace(/^0/, "212");
  const waMessage = encodeURIComponent(
    `Hi, I'm interested in your ${service.title} service.`
  );
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${waMessage}`
    : "#";

  return (
    <div className="group relative flex flex-col rounded-xl border bg-card transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-[350px] border-t-2 border-t-blue-500 dark:border-t-blue-400">
      <div className="flex flex-col gap-4 p-6 flex-1 min-h-0 overflow-hidden">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon className="w-7 h-7" />
        </div>

        <h3 className="text-[16px] font-semibold text-zinc-800 dark:text-zinc-200 leading-tight flex-shrink-0">
          {service.title}
        </h3>

        <div
          ref={scrollRef}
          className={`flex-1 overflow-y-auto min-h-0 pr-1 scrollbar-custom ${
            isScrolling ? "scrolling" : ""
          }`}
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 px-6 pb-6">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Let&apos;s get started
        </a>
      </div>
    </div>
  );
}
