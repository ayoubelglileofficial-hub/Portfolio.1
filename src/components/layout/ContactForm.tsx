"use client";

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const WA_NUMBER = "212687976771"; // <-- YOUR WHATSAPP NUMBER HERE
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // <-- YOUR EMAILJS PUBLIC KEY
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // <-- YOUR EMAILJS SERVICE ID
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // <-- YOUR EMAILJS TEMPLATE ID

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const initialForm: FormData = { name: "", email: "", phone: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!form.name.trim()) errs.name = "Full name is required";

    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Please enter a valid email address";
    }

    if (!form.message.trim()) errs.message = "Message is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypotRef.current?.value) return;

    if (!validate()) return;

    setSending(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name.trim(),
          from_email: form.email.trim(),
          from_phone: form.phone.trim(),
          message: form.message.trim(),
        },
        EMAILJS_PUBLIC_KEY
      );

      toast.success("Message sent successfully!");
      setSent(true);
      setForm(initialForm);

      const waMessage = encodeURIComponent(
        `Hi! I'm ${form.name.trim()}\nEmail: ${form.email.trim()}\nPhone: ${form.phone.trim() || "Not provided"}\nMessage: ${form.message.trim()}`
      );

      window.open(`https://wa.me/${WA_NUMBER}?text=${waMessage}`, "_blank");
    } catch (err) {
      console.error("EmailJS error:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot -- invisible to users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input
          ref={honeypotRef}
          type="text"
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cf_name">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="cf_name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cf_email">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="cf_email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@example.com"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cf_phone">Phone Number (optional)</Label>
        <Input
          id="cf_phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+1 234 567 890"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cf_message">
          Message <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="cf_message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about your project..."
          rows={5}
          className={errors.message ? "border-red-500" : ""}
        />
        {errors.message && (
          <p className="text-xs text-red-500">{errors.message}</p>
        )}
      </div>

      {sent ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          Message sent! WhatsApp will open shortly.
        </div>
      ) : (
        <Button
          type="submit"
          disabled={sending}
          className="w-full h-12 font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
        >
          {sending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      )}
    </form>
  );
}
