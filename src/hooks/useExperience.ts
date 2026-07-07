'use client';

import useSWR from 'swr';
import { Experience } from '@/types/experience';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useExperience() {
  const { data, error, isLoading, mutate } = useSWR<Experience[]>('/api/experience', fetcher);

  return {
    experiences: data || [],
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch experiences') : null,
    mutate,
  };
}
