'use client';

import { useState, useEffect } from 'react';
import { Skill } from '@/types/skill';

export function useSkills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSkills() {
            try {
                const res = await fetch('/api/skills');
                if (!res.ok) throw new Error('Failed to fetch skills');
                const data = await res.json();
                setSkills(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        fetchSkills();
    }, []);

    return { skills, loading, error };
}
