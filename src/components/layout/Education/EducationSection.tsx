import connectDB from "@/lib/mongodb";
import Education from "@/models/Education";
import AttestationButton from "@/components/layout/Experience/AttestationButton";
import { Plus } from "lucide-react";

interface EducationDoc {
  _id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  project: string;
  attestationUrl: string;
  align: "left" | "right";
  order_index: number;
  isVisible: boolean;
  created_at: Date;
  updated_at: Date;
}

interface EducationSectionProps {
  hidden?: boolean;
  isAdmin?: boolean;
}

function TimelineDot() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 z-10">
      <div className="w-4 h-4 rounded-full border-4 border-emerald-500 bg-white dark:bg-zinc-900 shadow-sm" />
    </div>
  );
}

function TimelineLine() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-400" />
  );
}

function EducationCard({
  education,
  side,
}: {
  education: EducationDoc;
  side: "left" | "right";
}) {
  const isLeft = side === "left";

  return (
    <div
      className={`flex w-full ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-col items-start md:items-center`}
    >
      <div
        className={`w-full md:w-[calc(50%-1.5rem)] ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"}`}
      >
        <div className="rounded-xl border bg-card text-card-foreground p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className={isLeft ? "md:text-right" : ""}>
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">
                {education.title}
              </h3>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {education.company}
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3 font-mono">
            {education.period}
          </p>

          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {education.description}
          </p>

          {education.project && (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Plus className="h-3 w-3" />
              project : {education.project}
            </span>
          )}

          <AttestationButton attestationUrl={education.attestationUrl} />
        </div>
      </div>

      <div className="hidden md:block w-[3rem] shrink-0 relative flex items-center justify-center">
        <TimelineDot />
      </div>

      <div className="hidden md:block w-[calc(50%-1.5rem)]" />
    </div>
  );
}

export default async function EducationSection({
  hidden,
  isAdmin,
}: EducationSectionProps) {
  await connectDB();
  const educations = await Education.find()
    .sort({ order_index: 1 })
    .lean();

  if (!educations || educations.length === 0) return null;
  if (hidden && !isAdmin) return null;

  const preview = hidden && isAdmin;
  const visible = isAdmin
    ? (educations as EducationDoc[])
    : (educations as EducationDoc[]).filter((e) => e.isVisible);

  if (visible.length === 0) return null;

  return (
    <section
      id="education"
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
            {preview ? "Education (Hidden)" : "Education"}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            Academic background
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block">
            <TimelineLine />
          </div>

          <div className="space-y-8 md:space-y-12 relative">
            {visible.map((education) => (
              <EducationCard
                key={education._id}
                education={education}
                side={education.align}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
