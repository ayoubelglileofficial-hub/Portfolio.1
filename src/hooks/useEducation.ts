'use client';

import useSWR from 'swr';
import { Education } from '@/types/education';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useEducation() {
  const { data, error, isLoading, mutate } = useSWR<Education[]>('/api/education', fetcher);

  return {
    educations: data || [],
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch educations') : null,
    mutate,
  };
}
