import connectDB from "@/lib/mongodb";
import Skill from "@/models/Skill";
import SkillBadge from "@/components/ui/SkillBadge";

interface SkillDoc {
  _id: string;
  name: string;
  slug: string;
  category: string;
  length_of_experience: string;
  icon: string;
  color: string;
  is_highlighted: boolean;
  order_index: number;
}

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Databases",
  devops: "DevOps & Cloud",
  tools: "Tools",
  soft_skills: "Soft Skills",
  language: "Languages",
};

const categoryOrder = [
  "frontend",
  "backend",
  "database",
  "devops",
  "tools",
  "soft_skills",
  "language",
];

interface SkillsSectionProps {
  hidden?: boolean;
}

export default async function SkillsSection({ hidden }: SkillsSectionProps) {
  await connectDB();
  const skills = await Skill.find().sort({ order_index: 1 }).lean();

  if (!skills || skills.length === 0) {
    return null;
  }

  const grouped: Record<string, SkillDoc[]> = {};
  for (const skill of skills as SkillDoc[]) {
    const cat = skill.category || "other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(skill);
  }

  return (
    <section id="skills" className="flex flex-col items-center w-full font-mono scroll-mt-20">
      <div className={`w-11/12 rounded-xl border p-8 ${hidden ? 'bg-red-500/5 border-red-200 dark:border-red-900/50' : 'bg-muted/60 border-zinc-200 dark:border-transparent'}`}>
        <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl font-bold ${hidden ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>
            {hidden ? 'Skills (Hidden)' : 'Skills'}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            Technologies and tools I work with
          </p>
        </div>

        <div className="space-y-10">
          {categoryOrder
            .filter((cat) => grouped[cat])
            .map((cat) => (
              <div key={cat}>
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
                  <span
                    className="inline-block w-1 h-5 rounded-full"
                    style={{
                      backgroundColor:
                        cat === "frontend"
                          ? "#3b82f6"
                          : cat === "backend"
                          ? "#22c55e"
                          : cat === "database"
                          ? "#a855f7"
                          : cat === "devops"
                          ? "#f97316"
                          : cat === "tools"
                          ? "#06b6d4"
                          : cat === "soft_skills"
                          ? "#ec4899"
                          : "#8b5cf6",
                    }}
                  />
                  {categoryLabels[cat] || cat}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {grouped[cat]
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((skill) => (
                      <SkillBadge
                        key={skill._id}
                        name={skill.name}
                        icon={skill.icon}
                        color={skill.color}
                        experience={skill.length_of_experience}
                        highlighted={skill.is_highlighted}
                      />
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
