import { GitBranchPlus, Globe, Link, Mail, MapPin, Phone } from "lucide-react";
import UniversalImage from "@/components/ui/universal-image";
import connectDB from "@/lib/mongodb";
import Profile from "@/models/Profile";

export default async function Profil() {
  await connectDB();
  const profil = await Profile.findOne({ _id: "prof_001" }).lean();

  const isVisible = profil?.isVisible;
console.log('Profile visibility:', isVisible);
  if (isVisible === false) {
    console.log('Profile visibilityy:', isVisible);
    return null;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full font-mono">
      <div className="w-11/12 bg-muted/60 rounded-xl border border-zinc-200 p-8 flex flex-col items-center justify-center dark:border-transparent">
        {/* Profil info */}
        <div className="pt-14 pb-6 px-6 text-center">
          <h2 className="text-6xl font-bold text-zinc-900 dark:text-white">
            I'm {profil.full_name}
          </h2>
          <p className="text-5xl text-blue-600 dark:text-blue-400 font-medium mt-1">
            <span className="border-2 px-4 rounded-xl border-amber-50/50">
              {profil.title}
            </span>{" "}
            Developer
          </p>
          <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mt-4 italic">
            &ldquo;{profil.short_bio}&rdquo;
          </p>
        </div>

        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 relative overflow-hidden rounded-full border-4 border-white dark:border-zinc-900 z-10">
          <UniversalImage
            src={profil.avatar_url}
            alt={profil.full_name}
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>

        {/* Bio o Contact */}
        <div className="inset-0 pointer-events-none">
          <div className="top-110 left-71 bg-accent p-6 pb-4 border-3 rounded-xl w-[500px] rotate-[1.5deg] animate-float-45 pointer-events-auto">
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed text-center">
              {profil.bio_1}
            </p>
          </div>

          <div className="top-170 left-71 bg-accent p-6 pb-4 border-3 rounded-xl w-[500px] rotate-[1.5deg] animate-float-45 pointer-events-auto">
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed text-center">
              {profil.bio_2}
            </p>
          </div>

          <div className="right-4 top-10 bg-accent p-6 pb-4 border-3 rounded-xl w-[500px] rotate-[1.5deg] animate-float-45 pointer-events-auto">
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed text-center">
              {profil.bio_3}
            </p>
          </div>

          <div className="right-4 top-60 bg-accent p-6 pb-4 border-3 rounded-xl w-[500px] rotate-[1.5deg] animate-float-45 pointer-events-auto">
            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>{profil.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <Phone className="w-4 h-4 text-zinc-400" />
              <span>{profil.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <MapPin className="w-4 h-4 text-zinc-400" />
              <span>{profil.location}</span>
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="px-6 pb-6 flex justify-center gap-4">
          <a
            href={profil.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <GitBranchPlus className="w-5 h-5" />
          </a>
          <a
            href={profil.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Link className="w-5 h-5" />
          </a>
          <a
            href={profil.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Globe className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}