export const dynamic = 'force-dynamic';
export const revalidate = 0;

import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Profil from '@/components/layout/Profil';
import ProfileVisibilityToggle from '@/components/ProfileVisibilityToggle';
import ProfileForm from '@/components/layout/ProfileModal';
import { getSessionData } from '@/lib/auth';

export default async function HomePage() {
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
    <>
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

        <Profil hidden={!isVisible} isAdmin={isAdmin} />
        {/* <Projects /> */}
      {/* <Skills/> */}
      </div>
    </>
  );
}
