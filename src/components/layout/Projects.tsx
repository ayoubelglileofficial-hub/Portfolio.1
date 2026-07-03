'use client';

import { useProjects } from '@/hooks/useProjects';
import ProjectCard from '@/components/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';

function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="h-56 p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-3 w-1/2 pt-1" />
      </div>
    </div>
  );
}

export default function Projects() {
  const { projects, loading, error } = useProjects();

  return (
    <section id="projects" className="flex flex-col items-center w-full font-mono scroll-mt-20">
      <div className="w-11/12 rounded-xl border p-8 bg-muted/60 border-zinc-200 dark:border-transparent">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
            Projects
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            Things I&apos;ve built
          </p>
        </div>

        {error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            No projects to display yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="flex justify-center sm:block">
                <div className="w-[85%] sm:w-full">
                  <ProjectCard project={project} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
