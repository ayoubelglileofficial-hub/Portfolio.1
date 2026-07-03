'use client';

import useSWR from 'swr';
import { Project } from '@/types/project';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<Project[]>('/api/projects', fetcher);

  return {
    projects: data || [],
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch projects') : null,
    mutate,
  };
}
