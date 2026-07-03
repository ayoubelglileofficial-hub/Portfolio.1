import { getSkillIcon } from "@/lib/skill-icons";

interface SkillBadgeProps {
  name: string;
  icon: string;
  color?: string;
  experience?: string;
  highlighted?: boolean;
}

export default function SkillBadge({ name, icon, color: badgeColor, experience, highlighted = false }: SkillBadgeProps) {
  const { icon: Icon, color: defaultColor } = getSkillIcon(icon);
  const color = badgeColor || defaultColor;

  return (
    <div
      className={`group relative flex flex-col items-center justify-center gap-2 rounded-xl border p-6 transition-all duration-200 ${highlighted
          ? "bg-accent border-zinc-300 dark:border-zinc-600 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          : "bg-muted/40 border-transparent hover:bg-accent hover:border-zinc-300 dark:hover:border-zinc-600"
        }`}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 group-hover:bg-accent"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <Icon className="w-8 h-8" />
      </div>

      <div className="text-center">
        <p className="text-[16px] font-medium text-zinc-800 dark:text-zinc-200 leading-tight">
          {name}
        </p>
        {experience && (
          <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mt-0.5">
            {experience}
          </p>
        )}
      </div>

      {highlighted && (
        <span
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-background"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  );
}
