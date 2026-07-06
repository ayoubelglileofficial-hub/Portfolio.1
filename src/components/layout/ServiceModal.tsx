'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import { ServiceIconSelect } from '@/components/layout/ServiceIconSelect';

interface ServiceFormData {
  title: string;
  description: string;
  icon: string;
  order_index: number;
  isVisible: boolean;
}

interface ServiceModalProps {
  service?: (ServiceFormData & { _id?: string }) | null;
  onClose: () => void;
  onSave: () => void;
}

const defaultForm: ServiceFormData = {
  title: '',
  description: '',
  icon: '',
  order_index: 0,
  isVisible: true,
};

export default function ServiceModal({ service, onClose, onSave }: ServiceModalProps) {
  const [form, setForm] = useState<ServiceFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const isEditing = !!service?._id;

  useEffect(() => {
    if (service) {
      setForm({
        title: service.title || '',
        description: service.description || '',
        icon: service.icon || '',
        order_index: service.order_index ?? 0,
        isVisible: service.isVisible ?? true,
      });
    } else {
      setForm(defaultForm);
    }
  }, [service]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (!form.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!form.icon.trim()) {
      toast.error('Icon is required');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/services/${service!._id}` : '/api/services';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          updated_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save service');
      }

      toast.success(isEditing ? 'Service updated' : 'Service created');
      onSave();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save service');
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
            <h2 className="text-lg font-bold">{isEditing ? 'Edit Service' : 'Add Service'}</h2>
            <p className="text-sm text-muted-foreground">
              {isEditing ? 'Update service details' : 'Add a new service to your portfolio'}
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
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Web Design"
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
                placeholder="Describe what this service includes..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Icon <span className="text-red-500">*</span>
              </Label>
              <ServiceIconSelect
                value={form.icon}
                onChange={(key) => setForm((prev) => ({ ...prev, icon: key }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVisible"
                    checked={form.isVisible}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Visible</span>
                </label>
              </div>
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
                  'Update Service'
                ) : (
                  'Add Service'
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
