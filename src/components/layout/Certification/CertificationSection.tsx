import connectDB from "@/lib/mongodb";
import Certification from "@/models/Certification";
import AttestationButton from "@/components/layout/Experience/AttestationButton";
import { getSkillIcon } from "@/lib/skill-icons";

interface CertificationDoc {
  _id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  skills: string[];
  attestationUrl: string;
  order_index: number;
  isVisible: boolean;
  created_at: Date;
  updated_at: Date;
}

interface CertificationSectionProps {
  hidden?: boolean;
  isAdmin?: boolean;
}

function CertificationCard({ certification }: { certification: CertificationDoc }) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="mb-2">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">
          {certification.title}
        </h3>
        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
          {certification.organization}
        </p>
      </div>

      <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3 font-mono">
        {certification.period}
      </p>

      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed flex-1">
        {certification.description}
      </p>

      {certification.skills && certification.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {certification.skills.map((skill) => {
            const { icon: Icon, color } = getSkillIcon(skill);
            return (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                <Icon size={12} style={{ color }} />
                {skill}
              </span>
            );
          })}
        </div>
      )}

      <AttestationButton attestationUrl={certification.attestationUrl} />
    </div>
  );
}

export default async function CertificationSection({
  hidden,
  isAdmin,
}: CertificationSectionProps) {
  await connectDB();
  const certifications = await Certification.find()
    .sort({ order_index: 1 })
    .lean();

  if (!certifications || certifications.length === 0) return null;
  if (hidden && !isAdmin) return null;

  const preview = hidden && isAdmin;
  const visible = isAdmin
    ? (certifications as CertificationDoc[])
    : (certifications as CertificationDoc[]).filter((c) => c.isVisible);

  if (visible.length === 0) return null;

  return (
    <section
      id="certification"
      className="flex flex-col items-center w-full font-mono scroll-mt-20"
    >
      <div
        className={`w-11/12 rounded-xl border p-8 ${
          preview
            ? "bg-red-500/5 border-red-200 dark:border-red-900/50"
            : "bg-muted/60 border-zinc-200 dark:border-transparent"
        }`}
      >
        <div className="text-center mb-10">
          <h2
            className={`text-3xl md:text-4xl font-bold ${
              preview
                ? "text-red-500"
                : "text-zinc-900 dark:text-white"
            }`}
          >
            {preview ? "Certifications (Hidden)" : "Certifications"}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            Professional certifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((certification) => (
            <CertificationCard
              key={certification._id}
              certification={certification}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
