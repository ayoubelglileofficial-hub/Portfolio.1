'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, Layers } from 'lucide-react';
import SkillModal from './SkillModal';

interface SkillItem {
  _id: string;
  name: string;
  slug: string;
  category: string;
  length_of_experience: string;
  icon: string;
  color: string;
  is_highlighted: boolean;
  order_index: number;
}

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Databases',
  devops: 'DevOps & Cloud',
  tools: 'Tools',
  soft_skills: 'Soft Skills',
  language: 'Languages',
};

export default function SkillsManager() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [managerOpen, setManagerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/skills');
      if (!res.ok) throw new Error('Failed to fetch skills');
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (managerOpen) fetchSkills();
  }, [managerOpen, fetchSkills]);

  useEffect(() => {
    if (!managerOpen) return;
    document.body.style.overflow = 'hidden';
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setManagerOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [managerOpen]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete skill');
      toast.success('Skill deleted');
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete skill');
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = () => {
    setModalOpen(false);
    setEditingSkill(null);
    fetchSkills();
  };

  const grouped = skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
    const cat = skill.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <>
      <Button
        onClick={() => setManagerOpen(true)}
        className="flex items-center gap-2 px-3 py-2 h-auto text-sm font-mono font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <Layers className="h-4 w-4" />
        Manage Skills
      </Button>

      {managerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setManagerOpen(false);
          }}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl w-full overflow-hidden flex flex-col"
            style={{
              animation: 'slideUp 0.3s ease-out',
              maxHeight: '85vh',
              maxWidth: '800px',
            }}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Manage Skills</h2>
                  <p className="text-sm text-muted-foreground">{skills.length} total skills</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    setEditingSkill(null);
                    setModalOpen(true);
                  }}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Skill
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setManagerOpen(false)}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : skills.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-lg mb-2">No skills yet</p>
                  <p className="text-sm">Click &quot;Add Skill&quot; to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedCategories.map((cat) => (
                    <div key={cat}>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        {categoryLabels[cat] || cat}
                        <span className="ml-2 text-xs font-normal text-muted-foreground/60">
                          ({grouped[cat].length})
                        </span>
                      </h3>
                      <div className="space-y-2">
                        {grouped[cat]
                          .sort((a, b) => a.order_index - b.order_index)
                          .map((skill) => (
                            <div
                              key={skill._id}
                              className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold"
                                  style={{ backgroundColor: `${skill.color}20`, color: skill.color }}
                                >
                                  {skill.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {skill.name}
                                    </p>
                                    {skill.is_highlighted && (
                                      <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: skill.color }}
                                        title="Highlighted"
                                      />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">
                                    /{skill.slug}
                                    {skill.length_of_experience && ` · ${skill.length_of_experience}`}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setEditingSkill(skill);
                                    setModalOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                  onClick={() => handleDelete(skill._id)}
                                  disabled={deleting === skill._id}
                                >
                                  {deleting === skill._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <SkillModal
          skill={editingSkill}
          onClose={() => {
            setModalOpen(false);
            setEditingSkill(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
