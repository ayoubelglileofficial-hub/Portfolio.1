"use client";

import { skillIconMap, getSkillIcon } from "@/lib/skill-icons";
import { useState, useMemo, useRef, useEffect } from "react";

interface SkillSelectProps {
    value?: string;
    onChange: (skillKey: string) => void;
    placeholder?: string;
}

export function SkillSelect({ value, onChange, placeholder = "Search a skill..." }: SkillSelectProps) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const skillKeys = useMemo(() => Object.keys(skillIconMap), []);

    const filtered = useMemo(() => {
        if (!query.trim()) return skillKeys;
        const q = query.toLowerCase();
        return skillKeys.filter((key) => key.toLowerCase().includes(q));
    }, [query, skillKeys]);

    // close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function selectSkill(key: string) {
        onChange(key);
        setQuery("");
        setOpen(false);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!open) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filtered[activeIndex]) selectSkill(filtered[activeIndex]);
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    }

    const selected = value ? getSkillIcon(value) : null;

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                {selected && (
                    <selected.icon size={18} style={{ color: selected.color }} />
                )}
                <input
                    type="text"
                    value={open ? query : value ?? query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveIndex(0);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full outline-none text-sm"
                />
            </div>

            {open && filtered.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {filtered.map((key, i) => {
                        const { icon: Icon, color } = getSkillIcon(key);
                        return (
                            <li
                                key={key}
                                onMouseDown={() => selectSkill(key)}
                                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer ${i === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"
                                    }`}
                            >
                                <Icon size={16} style={{ color }} />
                                <span className="capitalize">{key}</span>
                            </li>
                        );
                    })}
                </ul>
            )}

            {open && filtered.length === 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400 shadow-lg">
                    No skill found
                </div>
            )}
        </div>
    );
}