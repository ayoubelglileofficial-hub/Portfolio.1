export const dynamic = 'force-dynamic'; // ← MUST be in the page file
export const revalidate = 0;              // ← MUST be in the page file

import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Profil from '@/components/layout/Profil';
import SkillsVisibilityToggle from '@/components/SkillsVisibilityToggle';
import ProfileForm from '@/components/layout/ProfileModal';
import { getSessionData } from '@/lib/auth';
import SkillsSection from '@/components/sections/SkillsSection';
export default async function Skills() {
  await connectDB();
  const profil = await Profile.findOne({ _id: 'prof_001' }).lean();
  const isVisible = profil
    ? profil.isVisible === true || profil.isVisible === 'true'
    : true;
    // Check if admin is logged in
  const session = await getSessionData();
  const isAdmin = session?.role === 'admin';
  return (
    <main>
      <div className="flex flex-col gap-6">
        {isAdmin && ( 
        <div className="flex items-center justify-end w-full space-x-4">
        <SkillsVisibilityToggle
          key={String(isVisible)}
          initialValue={isVisible}
          // className="self-end"
        />
        {/* <ProfileForm profile={profil} /> */}
        </div>)}  
      <SkillsSection />
      </div>
    </main>
  );
}