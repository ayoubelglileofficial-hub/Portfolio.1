'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';

interface ExperienceFormData {
  title: string;
  company: string;
  period: string;
  description: string;
  attestationUrl: string;
  align: 'left' | 'right';
  order_index: number;
  isVisible: boolean;
}

interface ExperienceAdminFormProps {
  item?: (ExperienceFormData & { _id?: string }) | null;
  onClose: () => void;
  onSave: () => void;
}

const defaultForm: ExperienceFormData = {
  title: '',
  company: '',
  period: '',
  description: '',
  attestationUrl: '',
  align: 'left',
  order_index: 0,
  isVisible: true,
};

export default function ExperienceAdminForm({ item, onClose, onSave }: ExperienceAdminFormProps) {
  const [form, setForm] = useState<ExperienceFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const isEditing = !!item?._id;

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || '',
        company: item.company || '',
        period: item.period || '',
        description: item.description || '',
        attestationUrl: item.attestationUrl || '',
        align: item.align || 'left',
        order_index: item.order_index ?? 0,
        isVisible: item.isVisible ?? true,
      });
    } else {
      setForm(defaultForm);
    }
  }, [item]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;
    const checked = type === 'checkbox' ? target.checked : undefined;
    const value =
      type === 'checkbox'
        ? checked
        : type === 'number'
        ? Number(target.value)
        : target.value;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.company.trim()) {
      toast.error('Company is required');
      return;
    }
    if (!form.period.trim()) {
      toast.error('Period is required');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Description is required');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/experience/${item!._id}` : '/api/experience';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save experience');
      }

      toast.success(isEditing ? 'Experience updated' : 'Experience created');
      onSave();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl w-full overflow-hidden flex flex-col"
        style={{
          animation: 'slideUp 0.3s ease-out',
          maxHeight: '85vh',
          maxWidth: '600px',
        }}
      >
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
          <div>
            <h2 className="text-lg font-bold">{isEditing ? 'Edit Experience' : 'Add Experience'}</h2>
            <p className="text-sm text-muted-foreground">
              {isEditing ? 'Update experience details' : 'Add a new experience to your portfolio'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Full Stack Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">
                Period <span className="text-red-500">*</span>
              </Label>
              <Input
                id="period"
                name="period"
                value={form.period}
                onChange={handleChange}
                placeholder="10/2025 – Present"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your role and achievements..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attestationUrl">
                Attestation URL
              </Label>
              <Input
                id="attestationUrl"
                name="attestationUrl"
                value={form.attestationUrl}
                onChange={handleChange}
                placeholder="https://example.com/attestation.png"
              />
              {form.attestationUrl && (
                <div className="mt-2 rounded-lg border overflow-hidden bg-zinc-50 dark:bg-zinc-800">
                  <img
                    src={form.attestationUrl}
                    alt="Attestation preview"
                    className="max-h-48 w-full object-contain p-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="align">Align</Label>
                <select
                  id="align"
                  name="align"
                  value={form.align}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-lg border border-input bg-background dark:bg-zinc-800 dark:text-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_index">Order Index</Label>
                <Input
                  id="order_index"
                  name="order_index"
                  type="number"
                  value={form.order_index}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pb-2">
              <input
                type="checkbox"
                id="isVisible"
                name="isVisible"
                checked={form.isVisible}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isVisible" className="cursor-pointer">
                Visible
              </Label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="flex-1 h-12 font-semibold">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  'Update Experience'
                ) : (
                  'Add Experience'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
