'use client';

import { useEffect, useCallback } from 'react';
import { useState } from 'react';

interface AttestationButtonProps {
  attestationUrl: string;
}

export default function AttestationButton({ attestationUrl }: AttestationButtonProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  if (!attestationUrl) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        Attestation
      </button>

      {open && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    onClick={close}
  >
    <div
      className="relative max-w-3xl w-full max-h-[90vh] flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={close}
        className="absolute top-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800/90 text-white shadow-lg transition-colors hover:bg-zinc-700"
        aria-label="Close"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={close}
        className="block cursor-zoom-out rounded-lg focus:outline-none"
        aria-label="Close attestation"
      >
        <img
          src={attestationUrl}
          alt="Attestation"
          className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
        />
      </button>
    </div>
  </div>
)}
    </>
  );
}
