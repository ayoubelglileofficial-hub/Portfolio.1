export const dynamic = 'force-dynamic';
export const revalidate = 0;

import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Profil from '@/components/layout/Profil';
import ProfileVisibilityToggle from '@/components/ProfileVisibilityToggle';
import ProfileForm from '@/components/layout/ProfileModal';
import SkillsSection from '@/components/sections/SkillsSection';
import SkillsVisibilityToggle from '@/components/ui/SkillsVisibilityToggle';
import SkillsManager from '@/components/sections/SkillsManager';
import { getSessionData } from '@/lib/auth';

export default async function Home() {
  await connectDB();
  const profil = await Profile.findOne({ _id: 'prof_001' }).lean();
  const isVisible = profil
    ? profil.isVisible === true || profil.isVisible === 'true'
    : true;
  const showSkills = profil
    ? profil.show_skills === true || profil.show_skills === 'true'
    : true;

  const session = await getSessionData();
  const isAdmin = session?.role === 'admin';

  return (
    <main>
      <div className="flex flex-col gap-6">
        {isAdmin && (
          <div className="flex items-center justify-end w-full space-x-4">
            <ProfileVisibilityToggle
              key={String(isVisible)}
              initialValue={isVisible}
            />
            <ProfileForm profile={profil} />
          </div>
        )}

        <Profil />

        <div className="flex items-center justify-end w-full">
          {isAdmin && (
            <div className="flex items-center gap-3">
              <SkillsVisibilityToggle
                key={String(showSkills)}
                initialValue={showSkills}
              />
              <SkillsManager />
            </div>
          )}
        </div>

        <SkillsSection hidden={!showSkills} />
      </div>
    </main>
  );
}



// import connectDB from "@/lib/mongodb";
// import Profile from "@/models/Profile";
// import ToggleProfile from "@/components/layout/Profil";

// export default async function Home() {
//     await connectDB();
//     const profil = await Profile.findOne({ _id: "prof_001" }).lean();

//     return (
//         <div className="flex flex-col flex-1 items-center justify-center w-full font-mono">
//             <div className="w-11/12 bg-muted/60 rounded-xl border border-zinc-200 p-8 flex flex-col items-center justify-center dark:border-transparent">
//                 {/* Toggle checkbox - controls visibility of profile content */}
//                 <ToggleProfile profil={profil} />
//             </div>
//         </div>
//     );
// }