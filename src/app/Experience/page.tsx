export const dynamic = 'force-dynamic';
export const revalidate = 0;

import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { getSessionData } from '@/lib/auth';
import ExperienceSection from '@/components/layout/Experience/ExperienceSection';
import ExperienceAdminList from '@/components/layout/Experience/ExperienceAdminList';
import ExperienceVisibilityToggle from '@/components/layout/Experience/ExperienceVisibilityToggle';

export default async function Experience() {
  await connectDB();
  const profil = await Profile.findOne({ _id: 'prof_001' }).lean();
  const showExperience = profil
    ? profil.show_experience === true || profil.show_experience === 'true'
    : true;

  const session = await getSessionData();
  const isAdmin = session?.role === 'admin';

  return (
    <main>
      <div className="flex flex-col gap-6">
        {isAdmin && (
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center gap-3">
              <ExperienceVisibilityToggle
                key={String(showExperience)}
                initialValue={showExperience}
              />
              <ExperienceAdminList />
            </div>
          </div>
        )}

        <ExperienceSection hidden={!showExperience} isAdmin={isAdmin} />
      </div>
    </main>
  );
}
