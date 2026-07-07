"use client";

import { getSkillIcon } from "@/lib/skill-icons";
import { useSearchableDropdown } from "@/hooks/useSearchableDropdown";

interface SkillSelectProps {
    value?: string;
    onChange: (skillKey: string) => void;
    placeholder?: string;
}

export function SkillSelect({ value, onChange, placeholder = "Search a skill..." }: SkillSelectProps) {
    const {
        query, setQuery,
        filtered,
        activeIndex, setActiveIndex,
        open, setOpen,
        containerRef,
        handleKeyDown,
        resetSearch,
    } = useSearchableDropdown();

    function selectSkill(key: string) {
        onChange(key);
        resetSearch();
        setOpen(false);
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
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setOpen(true)}
                    onKeyDown={(e) => handleKeyDown(e, selectSkill)}
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
