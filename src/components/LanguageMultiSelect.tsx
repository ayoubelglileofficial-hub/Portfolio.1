'use client';

import { getSkillIcon } from '@/lib/skill-icons';
import { useSearchableDropdown } from '@/hooks/useSearchableDropdown';
import { Check, X } from 'lucide-react';

interface LanguageMultiSelectProps {
  value: string[];
  onChange: (keys: string[]) => void;
  placeholder?: string;
}

export default function LanguageMultiSelect({
  value,
  onChange,
  placeholder = 'Search a language...',
}: LanguageMultiSelectProps) {
  const {
    query,
    setQuery,
    filtered,
    activeIndex,
    setActiveIndex,
    open,
    setOpen,
    containerRef,
    handleKeyDown,
    resetSearch,
  } = useSearchableDropdown();

  const selectedSet = new Set(value);

  function toggleKey(key: string) {
    if (selectedSet.has(key)) {
      onChange(value.filter((k) => k !== key));
    } else {
      onChange([...value, key]);
    }
  }

  function handleKeyboard(e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && query === '' && value.length > 0) {
      onChange(value.slice(0, -1));
      return;
    }
    handleKeyDown(e, (key) => {
      toggleKey(key);
      resetSearch();
    });
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 min-h-[42px]">
        {value.map((key) => {
          const { icon: Icon, color } = getSkillIcon(key);
          return (
            <span
              key={key}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
            >
              <Icon size={14} style={{ color }} />
              <button
                type="button"
                onClick={() => toggleKey(key)}
                className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          );
        })}
        <input
          type="text"
          value={open ? query : ''}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyboard}
          placeholder={value.length === 0 ? placeholder : ''}
          className="min-w-[80px] flex-1 outline-none text-sm bg-transparent"
        />
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filtered.map((key, i) => {
            const { icon: Icon, color } = getSkillIcon(key);
            const isSelected = selectedSet.has(key);
            return (
              <li
                key={key}
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleKey(key);
                  resetSearch();
                }}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer ${
                  i === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                } ${isSelected ? 'font-medium' : ''}`}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <Icon size={16} style={{ color }} />
                <span className="capitalize flex-1">{key}</span>
                {isSelected && <Check size={14} className="text-blue-600" />}
              </li>
            );
          })}
        </ul>
      )}

      {open && filtered.length === 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400 shadow-lg">
          No language found
        </div>
      )}
    </div>
  );
}
