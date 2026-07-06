'use client';

import useSWR from 'swr';
import { Service } from '@/types/service';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useServices() {
  const { data, error, isLoading, mutate } = useSWR<Service[]>('/api/services', fetcher);

  return {
    services: data || [],
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch services') : null,
    mutate,
  };
}
