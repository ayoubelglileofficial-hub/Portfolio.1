"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ExperienceVisibilityToggleProps {
    initialValue?: boolean | string;
    onToggle?: (isVisible: boolean) => void;
    className?: string;
}

export default function ExperienceVisibilityToggle({
    initialValue = true,
    onToggle,
    className = "",
}: ExperienceVisibilityToggleProps) {
    const router = useRouter();
    const normalizedInitialValue =
        initialValue === 'false'
            ? false
            : initialValue === 'true'
            ? true
            : Boolean(initialValue);
    const [showExperience, setShowExperience] = useState(normalizedInitialValue);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        const newValue = !showExperience;
        setShowExperience(newValue);

        setIsLoading(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ show_experience: newValue }),
            });

            if (!res.ok) throw new Error("Failed to update experience visibility");

            onToggle?.(newValue);
            router.refresh();
        } catch (error) {
            console.error("Error updating experience visibility:", error);
            setShowExperience(!newValue);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <label
            className={`inline-flex items-center gap-3 cursor-pointer select-none ${className}`}
        >
            <div className="relative">
                <input
                    type="checkbox"
                    checked={showExperience}
                    onChange={handleToggle}
                    disabled={isLoading}
                    className="sr-only peer"
                />
                <div
                    className={`
          w-11 h-6 bg-zinc-300 peer-focus:outline-none peer-focus:ring-2 
          peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer 
          dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white 
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
          after:bg-white after:border-zinc-300 after:border after:rounded-full 
          after:h-5 after:w-5 after:transition-all dark:border-zinc-600 
          peer-checked:bg-blue-600
          ${isLoading ? "opacity-50" : ""}
        `}
                ></div>
            </div>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {showExperience ? "Experience Visible" : "Experience Hidden"}
            </span>
            {isLoading && <span className="text-xs text-zinc-500">Saving...</span>}
        </label>
    );
}
