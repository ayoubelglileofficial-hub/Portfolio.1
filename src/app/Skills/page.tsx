export const dynamic = 'force-dynamic';
export const revalidate = 0;

import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import SkillsSection from '@/components/layout/skills/SkillsSection';
import SkillsVisibilityToggle from '@/components/ui/SkillsVisibilityToggle';
import SkillsManager from '@/components/layout/skills/SkillsManager';
import { getSessionData } from '@/lib/auth';

export default async function Skills() {
  await connectDB();
  const profil = await Profile.findOne({ _id: 'prof_001' }).lean();
  const showSkills = profil
    ? profil.show_skills === true || profil.show_skills === 'true'
    : true;

  const session = await getSessionData();
  const isAdmin = session?.role === 'admin';

  return (
    <main>
      <div className="flex flex-col gap-6">
        {isAdmin && (
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center gap-3">
              <SkillsVisibilityToggle
                key={String(showSkills)}
                initialValue={showSkills}
              />
              <SkillsManager />
            </div>
          </div>
        )}

        <SkillsSection hidden={!showSkills} isAdmin={isAdmin} />
      </div>
    </main>
  );
}
