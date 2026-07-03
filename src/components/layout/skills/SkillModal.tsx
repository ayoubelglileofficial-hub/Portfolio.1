'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import { SkillSelect } from '@/components/layout/SkillSelect';

interface SkillFormData {
  name: string;
  slug: string;
  category: string;
  length_of_experience: string;
  icon: string;
  color: string;
  is_highlighted: boolean;
  order_index: number;
}

interface SkillModalProps {
  
  
  
  skill?: SkillFormData & { _id?: string } | null;
  onClose: () => void;
  onSave: () => void;
}

const categories = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Databases' },
  { value: 'devops', label: 'DevOps & Cloud' },
  { value: 'tools', label: 'Tools' },
  { value: 'soft_skills', label: 'Soft Skills' },
  { value: 'language', label: 'Languages' },
];

const defaultForm: SkillFormData = {
  name: '',
  slug: '',
  category: 'frontend',
  length_of_experience: '',
  icon: '',
  color: '#000000',
  is_highlighted: false,
  order_index: 0,
};

export default function SkillModal({ skill, onClose, onSave }: SkillModalProps) {
  const [form, setForm] = useState<SkillFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const isEditing = !!skill?._id;

  useEffect(() => {
    if (skill) {
      setForm({
        name: skill.name || '',
        slug: skill.slug || '',
        category: skill.category || 'frontend',
        length_of_experience: skill.length_of_experience || '',
        icon: skill.icon || '',
        color: skill.color || '#000000',
        is_highlighted: skill.is_highlighted || false,
        order_index: skill.order_index ?? 0,
      });
    } else {
      setForm(defaultForm);
    }
  }, [skill]);

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

  const slugify = (val: string) =>
    val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      if (name === 'name' && !isEditing) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Skill name is required');
      return;
    }
    if (!form.slug.trim()) {
      toast.error('Slug is required');
      return;
    }
    if (!form.category) {
      toast.error('Category is required');
      return;
    }
    if (!form.icon.trim()) {
      toast.error('Icon key is required');
      return;
    }
    if (!form.color.trim()) {
      toast.error('Color is required');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/skills/${skill!._id}` : '/api/skills';
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
        throw new Error(err.error || 'Failed to save skill');
      }

      toast.success(isEditing ? 'Skill updated' : 'Skill created');
      onSave();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save skill');
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
            <h2 className="text-lg font-bold">{isEditing ? 'Edit Skill' : 'Add Skill'}</h2>
            <p className="text-sm text-muted-foreground">
              {isEditing ? 'Update skill details' : 'Add a new skill to your portfolio'}
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
                <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="React" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug <span className="text-red-500">*</span></Label>
                <Input id="slug" name="slug" value={form.slug} onChange={handleChange} placeholder="react" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-lg border border-input bg-background dark:bg-zinc-800 dark:text-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="length_of_experience">Experience</Label>
                <Input
                  id="length_of_experience"
                  name="length_of_experience"
                  value={form.length_of_experience}
                  onChange={handleChange}
                  placeholder="3 years"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon key <span className="text-red-500">*</span></Label>
                <SkillSelect
                  value={form.icon}
                  onChange={(key) => setForm((prev) => ({ ...prev, icon: key }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color <span className="text-red-500">*</span></Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    placeholder="#61DAFB"
                  />
                  <input
                    type="color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="w-11 h-11 rounded-lg border border-input bg-background p-1 cursor-pointer flex-shrink-0"
                  />
                </div>
              </div>
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
                    name="is_highlighted"
                    checked={form.is_highlighted}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Highlighted</span>
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
                  'Update Skill'
                ) : (
                  'Add Skill'
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
