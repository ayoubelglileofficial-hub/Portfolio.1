import { MessageCircle, Mail, MapPin } from "lucide-react";
import { GitHub, LinkedIn, WhatsApp } from "@deemlol/next-icons";
import ContactForm from "./ContactForm";

interface ContactSectionProps {
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
}

export default function ContactSection({
  email,
  phone,
  location,
  githubUrl,
  linkedinUrl,
}: ContactSectionProps) {
  const waNumber = (phone || "")
    .replace(/\D/g, "")
    .replace(/^0/, "212");

  return (
    <section
      id="contact"
      className="flex flex-col items-center w-full font-mono scroll-mt-20"
    >
      <div className="w-11/12 rounded-xl p-8 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ---------- LEFT COLUMN ---------- */}
          <div className="flex flex-col gap-6">
            {/* Illustration placeholder */}
            <div className="hidden lg:flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-200/50 dark:border-blue-800/30 p-8">
              <svg
                viewBox="0 0 400 280"
                fill="none"
                className="w-full max-w-xs h-auto"
                aria-hidden="true"
              >
                <rect width="400" height="280" rx="16" fill="url(#cg)" />

                <circle cx="120" cy="100" r="32" fill="#3b82f6" opacity="0.2" />
                <circle cx="120" cy="100" r="16" fill="#3b82f6" opacity="0.5" />

                <rect x="180" y="76" width="160" height="8" rx="4" fill="#3b82f6" opacity="0.7" />

                <rect x="180" y="96" width="120" height="6" rx="3" fill="#d1d5db" />
                <rect x="180" y="112" width="140" height="6" rx="3" fill="#d1d5db" />

                <rect x="80" y="156" width="240" height="1" rx="1" fill="#e5e7eb" />

                <rect x="80" y="176" width="48" height="48" rx="12" fill="#3b82f6" opacity="0.15" />
                <rect x="144" y="186" width="100" height="6" rx="3" fill="#d1d5db" />
                <rect x="144" y="200" width="72" height="4" rx="2" fill="#e5e7eb" />

                <rect x="80" y="236" width="48" height="48" rx="12" fill="#3b82f6" opacity="0.15" />
                <rect x="144" y="246" width="100" height="6" rx="3" fill="#d1d5db" />
                <rect x="144" y="260" width="72" height="4" rx="2" fill="#e5e7eb" />

                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="400" y2="280">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.06" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Title + Description */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
                Let&apos;s Speak
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                Have a project in mind? I&apos;d love to hear about it. Feel
                free to contact me through the form or one of my social
                platforms.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="h-4 w-4 text-blue-500" />
                {email}
              </a>
              {phone && (
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  {phone}
                </a>
              )}
              {location && (
                <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  {location}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="LinkedInColor px-2.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-[#0077b5] hover:text-white transition-all duration-300"
                aria-label="LinkedIn"
              >
                <LinkedIn className="w-5 h-5" />
              </a>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="GitHubColor px-2.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-blue-500 hover:text-white transition-all duration-300"
                aria-label="GitHub"
              >
                <GitHub className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="WebsiteColor px-2.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-[#0d972b] hover:text-white transition-all duration-300"
                aria-label="WhatsApp"
              >
                <WhatsApp className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${email}`}
                className="EmailColor px-2.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-[#c71610] hover:text-white transition-all duration-300"
                aria-label="Gmail"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* ---------- RIGHT COLUMN ---------- */}
          <div className="rounded-xl border bg-card/60 backdrop-blur-sm p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
              Send a Message
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
