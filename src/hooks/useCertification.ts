'use client';
import useSWR from 'swr';
import { Certification } from '@/types/certification';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCertification() {
  const { data, error, isLoading, mutate } = useSWR<Certification[]>('/api/certification', fetcher);
  return {
    certifications: data || [],
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch certifications') : null,
    mutate,
  };
}
