'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import LanguageMultiSelect from '@/components/LanguageMultiSelect';

interface ProjectFormData {
  name: string;
  title: string;
  photo: string;
  description: string;
  languages: string[];
  demoLink: string;
  githubLink: string;
  order_index: number;
  is_featured: boolean;
}

interface ProjectModalProps {
  project?: (ProjectFormData & { _id?: string }) | null;
  onClose: () => void;
  onSave: () => void;
}

const defaultForm: ProjectFormData = {
  name: '',
  title: '',
  photo: '',
  description: '',
  languages: [],
  demoLink: '',
  githubLink: '',
  order_index: 0,
  is_featured: false,
};

export default function ProjectModal({ project, onClose, onSave }: ProjectModalProps) {
  const [form, setForm] = useState<ProjectFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const isEditing = !!project?._id;

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || '',
        title: project.title || '',
        photo: project.photo || '',
        description: project.description || '',
        languages: project.languages || [],
        demoLink: project.demoLink || '',
        githubLink: project.githubLink || '',
        order_index: project.order_index ?? 0,
        is_featured: project.is_featured || false,
      });
    } else {
      setForm(defaultForm);
    }
  }, [project]);

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

    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.photo.trim()) {
      toast.error('Photo URL is required');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (form.languages.length === 0) {
      toast.error('At least one language/tech is required');
      return;
    }
    if (!form.demoLink.trim()) {
      toast.error('Demo link is required');
      return;
    }
    if (!form.githubLink.trim()) {
      toast.error('GitHub link is required');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/projects/${project!._id}` : '/api/projects';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          title: form.title,
          photo: form.photo,
          description: form.description,
          languages: form.languages,
          demoLink: form.demoLink,
          githubLink: form.githubLink,
          order_index: form.order_index,
          is_featured: form.is_featured,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save project');
      }

      toast.success(isEditing ? 'Project updated' : 'Project created');
      onSave();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save project');
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
            <h2 className="text-lg font-bold">{isEditing ? 'Edit Project' : 'Add Project'}</h2>
            <p className="text-sm text-muted-foreground">
              {isEditing ? 'Update project details' : 'Add a new project to your portfolio'}
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
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="my-project-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="My Project"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">
                Photo URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="photo"
                name="photo"
                value={form.photo}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
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
                placeholder="Describe what this project does..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Languages / Tech <span className="text-red-500">*</span>
              </Label>
              <LanguageMultiSelect
                value={form.languages}
                onChange={(keys) => setForm((prev) => ({ ...prev, languages: keys }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="demoLink">
                  Demo Link <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="demoLink"
                  name="demoLink"
                  value={form.demoLink}
                  onChange={handleChange}
                  placeholder="https://demo.vercel.app"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubLink">
                  GitHub Link <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="githubLink"
                  name="githubLink"
                  value={form.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/user/repo"
                />
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
                    name="is_featured"
                    checked={form.is_featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Featured</span>
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
                  'Update Project'
                ) : (
                  'Add Project'
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
