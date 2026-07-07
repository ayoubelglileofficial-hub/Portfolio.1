"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EducationVisibilityToggleProps {
    initialValue?: boolean | string;
    onToggle?: (isVisible: boolean) => void;
    className?: string;
}

export default function EducationVisibilityToggle({
    initialValue = true,
    onToggle,
    className = "",
}: EducationVisibilityToggleProps) {
    const router = useRouter();
    const normalizedInitialValue =
        initialValue === 'false'
            ? false
            : initialValue === 'true'
            ? true
            : Boolean(initialValue);
    const [showEducation, setShowEducation] = useState(normalizedInitialValue);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        const newValue = !showEducation;
        setShowEducation(newValue);

        setIsLoading(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ show_education: newValue }),
            });

            if (!res.ok) throw new Error("Failed to update education visibility");

            onToggle?.(newValue);
            router.refresh();
        } catch (error) {
            console.error("Error updating education visibility:", error);
            setShowEducation(!newValue);
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
                    checked={showEducation}
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
                {showEducation ? "Education Visible" : "Education Hidden"}
            </span>
            {isLoading && <span className="text-xs text-zinc-500">Saving...</span>}
        </label>
    );
}
