'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, Award } from 'lucide-react';
import CertificationAdminForm from './CertificationAdminForm';

interface CertificationItem {
  _id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  skills: string[];
  attestationUrl: string;
  order_index: number;
  isVisible: boolean;
}

export default function CertificationAdminList() {
  const [items, setItems] = useState<CertificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [managerOpen, setManagerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificationItem | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/certification');
      if (!res.ok) throw new Error('Failed to fetch certifications');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (managerOpen) fetchItems();
  }, [managerOpen]);

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
    if (!confirm('Are you sure you want to delete this certification?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/certification/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete certification');
      toast.success('Certification deleted');
      setItems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete certification');
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = () => {
    setModalOpen(false);
    setEditingItem(null);
    fetchItems();
  };

  const sorted = [...items].sort((a, b) => a.order_index - b.order_index);

  return (
    <>
      <Button
        onClick={() => setManagerOpen(true)}
        className="flex items-center gap-2 px-3 py-2 h-auto text-sm font-mono font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <Award className="h-4 w-4" />
        Manage Certification
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
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Manage Certifications</h2>
                  <p className="text-sm text-muted-foreground">{items.length} total entries</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    setEditingItem(null);
                    setModalOpen(true);
                  }}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Certification
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
              ) : items.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-lg mb-2">No certifications yet</p>
                  <p className="text-sm">Click &quot;Add Certification&quot; to get started</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sorted.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.title}
                            </p>
                            {!item.isVisible && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 flex-shrink-0">
                                Hidden
                              </span>
                            )}
                            {item.skills && item.skills.length > 0 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 flex-shrink-0">
                                {item.skills.length} skills
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.organization}
                            {item.period && ` · ${item.period}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingItem(item);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => handleDelete(item._id)}
                          disabled={deleting === item._id}
                        >
                          {deleting === item._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
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
        <CertificationAdminForm
          item={editingItem}
          onClose={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
