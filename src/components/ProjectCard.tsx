'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { getSkillIcon } from '@/lib/skill-icons';
import { GitHub } from '@deemlol/next-icons';

const FALLBACK_IMG = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22192%22%3E%3Crect width=%22800%22 height=%22192%22 fill=%22%23e4e4e7%22/%3E%3Ctext x=%22400%22 y=%2296%22 text-anchor=%22middle%22 fill=%22%23a1a1aa%22 font-size=%2220%22%3ENo Image%3C/text%3E%3C/svg%3E';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [imgSrc, setImgSrc] = useState(project.photo);

  return (
    <Link
      href={project.demoLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="rounded-xl border w-full sm:max-w-sm bg-card text-card-foreground overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="h-48 shrink-0 overflow-hidden bg-muted">
          <img
            src={imgSrc}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgSrc(FALLBACK_IMG)}
          />
        </div>

        <div className="h-56 overflow-y-auto p-4 space-y-6">
          <h3 className="font-semibold text-base leading-tight text-foreground">
            {project.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.languages.map((key) => {
              const { icon: Icon, color } = getSkillIcon(key);
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                >
                  <Icon size={14} style={{ color }} />
                </span>
              );
            })}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(project.githubLink, "_blank", "noopener,noreferrer");
            }}
            className="inline-flex items-center rounded-md bg-black p-2 text-white hover:bg-neutral-800"
          >
            <GitHub className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
