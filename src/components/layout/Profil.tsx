import { Mail, MapPin, Phone } from "lucide-react";
import { GitHub, LinkedIn, WhatsApp } from "@deemlol/next-icons";
import UniversalImage from "@/components/ui/universal-image";
import { ContactScrollButton } from "@/components/layout/ContactScrollButton";

interface ProfilProps {
  hidden?: boolean;
  isAdmin?: boolean;
}

export default async function Profil({ hidden, isAdmin }: ProfilProps) {
  const { default: connectDB } = await import("@/lib/mongodb");
  const { default: Profile } = await import("@/models/Profile");

  await connectDB();
  const profil = await Profile.findOne({ _id: "prof_001" }).lean();

  if (!profil) return null;
  if (hidden && !isAdmin) return null;

  const preview = hidden && isAdmin;

  return (
    <section id="about" className="flex flex-col flex-1 items-center justify-center w-full font-mono scroll-mt-20">
      <div className={`relative w-11/12 rounded-xl border p-8 xl:p-2 2xl:p-8 flex flex-col items-center justify-between xl:min-h-[81vh] 2xl:min-h-[85vh] ${preview ? 'bg-red-500/5 border-red-200 dark:border-red-900/50' : 'bg-muted/60 border-zinc-200 dark:border-transparent'}`}>

        <div className="pt-14 pb-6 px-6 text-center">
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold ${preview ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>
            {preview ? "Profile (Hidden)" : `I'm ${profil.full_name}`}
          </h2>
          {!preview && (
            <>
              <p className="text-3xl md:text-4xl lg:text-5xl text-blue-600 dark:text-blue-400 font-medium mt-1">
                <span className="border-2 px-4 mx-0 rounded-xl border-blue-400 dark:border-amber-50/50">
                  {profil.title}
                </span>{" "}
                Developer
              </p>
              <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mt-4 italic">
                &ldquo;{profil.short_bio}&rdquo;
              </p>
            </>
          )}
        </div>

        {!preview && (
          <>
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-64 lg:h-64 xl:w-72 xl:h-72 overflow-hidden rounded-full border-4 border-white dark:border-zinc-900 z-10 my-6 lg:my-0">
              <UniversalImage
                src={profil.avatar_url}
                alt={profil.full_name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, (max-width: 1280px) 288px, 288px"
              />
            </div>

            <div className="px-6 pb-6 pt-6 xl:pt-2 flex justify-center gap-6">
              <a href={profil.github_url} target="_blank" rel="noopener noreferrer" className="GitHubColor px-2.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <GitHub className="w-5 h-5" />
              </a>
              <a href={profil.linkedin_url} target="_blank" rel="noopener noreferrer" className="LinkedInColor px-2.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <LinkedIn className="w-5 h-5" />
              </a>
              <a href={`https://wa.me/${(profil.phone || "").replace(/\D/g, "").replace(/^0/, "212")}?text=${encodeURIComponent("Hi Ayoub, I'm here to help you")}`} target="_blank" rel="noopener noreferrer" className="WebsiteColor px-2.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <WhatsApp className="w-5 h-5" />
              </a>
              <a href={`mailto:${profil.email}?subject=${encodeURIComponent("Help Request")}&body=${encodeURIComponent("Hi Ayoub,\n\nI'm reaching out to help you.\n\nBest regards")}`} className="EmailColor px-2.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <ContactScrollButton className="ContactColor px-4 py-2 rounded-lg border-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                Hire Me
              </ContactScrollButton>
            </div>

            <div className="flex flex-col xl:flex-row items-center justify-between w-full xl:w-[94%] 2xl:w-[88%] xl:absolute xl:inset-0 xl:pointer-events-none mt-6 xl:mt-30 xl:ml-10 2xl:ml-18 2xl:mt-55">
              <div className="flex flex-col space-y-6 xl:space-y-10 w-full xl:w-auto items-center xl:items-start">
                <div className="bg-accent p-6 pb-4 border-3 rounded-xl w-full max-w-[650px] xl:w-[400px] 2xl:w-[405px] xl:rotate-[1.3deg] animationInfo">
                  <p className="text-sm xl:text-[12px] 2xl:text-[14px] text-zinc-600 dark:text-zinc-300 leading-relaxed text-center">{profil.bio_1}</p>
                </div>
                <div className="bg-accent p-6 pb-4 border-3 rounded-xl w-full max-w-[650px] xl:w-[400px] 2xl:w-[405px] xl:rotate-[1.3deg] animationInfo">
                  <p className="text-sm xl:text-[12px] 2xl:text-[14px] text-zinc-600 dark:text-zinc-300 leading-relaxed text-center">{profil.bio_2}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-6 xl:space-y-10 w-full xl:w-auto items-center xl:items-end mt-6 xl:mt-0">
                <div className="bg-accent p-6 pb-4 border-3 rounded-xl w-full max-w-[650px] xl:w-[400px] 2xl:w-[405px] xl:rotate-[1.3deg] animationInfo">
                  <p className="text-sm xl:text-[12px] 2xl:text-[14px] text-zinc-600 dark:text-zinc-300 leading-relaxed text-center">{profil.bio_3}</p>
                </div>
                <div className="text-sm xl:text-[12px] 2xl:text-[14px] bg-accent p-6 pb-4 border-3 rounded-xl w-full max-w-[650px] xl:w-[400px] 2xl:w-[405px] xl:rotate-[1.3deg] animationInfo">
                  <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span>{profil.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    <span>{profil.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span>{profil.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
