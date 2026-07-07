import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectCard from "@/components/ProjectCard";

interface ProjectDoc {
  _id: string;
  name: string;
  title: string;
  photo: string;
  description: string;
  languages: string[];
  demoLink: string;
  githubLink: string;
  order_index: number;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

interface ProjectsSectionProps {
  hidden?: boolean;
  isAdmin?: boolean;
}

export default async function ProjectsSection({ hidden, isAdmin }: ProjectsSectionProps) {
  await connectDB();
  const projects = await Project.find().sort({ order_index: 1 }).lean();

  if (!projects || projects.length === 0) return null;
  if (hidden && !isAdmin) return null;

  const preview = hidden && isAdmin;

  return (
    <section id="projects" className="flex flex-col items-center w-full font-mono scroll-mt-20">
      <div className={`w-11/12 rounded-xl border p-8 ${preview ? 'bg-red-500/5 border-red-200 dark:border-red-900/50' : 'bg-muted/60 border-zinc-200 dark:border-transparent'}`}>
        <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl font-bold ${preview ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>
            {preview ? 'Projects (Hidden)' : 'Projects'}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            Things I&apos;ve built
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mx-auto">
            {(projects as ProjectDoc[])
            .sort((a, b) => a.order_index - b.order_index)
            .map((project) => (
              <div key={project._id} className="flex justify-center sm:block">
                <div className="w-[85%] sm:w-full">
                  <ProjectCard
                    project={{
                      ...project,
                      _id: String(project._id),
                      created_at: project.created_at?.toISOString?.() ?? '',
                      updated_at: project.updated_at?.toISOString?.() ?? '',
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
