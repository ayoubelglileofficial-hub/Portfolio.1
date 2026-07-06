'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { skillIconMap } from '@/lib/skill-icons';

export function useSearchableDropdown(keys?: string[]) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const itemKeys = useMemo(() => keys ?? Object.keys(skillIconMap), [keys]);

  const filtered = useMemo(() => {
    if (!query.trim()) return itemKeys;
    const q = query.toLowerCase();
    return itemKeys.filter((key) => key.toLowerCase().includes(q));
  }, [query, itemKeys]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetSearch = useCallback(() => {
    setQuery('');
    setActiveIndex(0);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, onSelect: (key: string) => void) => {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[activeIndex]) onSelect(filtered[activeIndex]);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    [open, filtered, activeIndex]
  );

  return {
    query,
    setQuery: (val: string) => {
      setQuery(val);
      setActiveIndex(0);
      setOpen(true);
    },
    filtered,
    activeIndex,
    setActiveIndex,
    open,
    setOpen,
    containerRef,
    handleKeyDown,
    resetSearch,
  };
}
