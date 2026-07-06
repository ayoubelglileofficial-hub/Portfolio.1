export const dynamic = 'force-dynamic';
export const revalidate = 0;

import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Profil from '@/components/layout/Profil';
import ProfileVisibilityToggle from '@/components/ProfileVisibilityToggle';
import ProfileForm from '@/components/layout/ProfileModal';
// import SkillsSection from '@/components/layout/skills/SkillsSection';
// import SkillsVisibilityToggle from '@/components/ui/SkillsVisibilityToggle';
// import SkillsManager from '@/components/layout/skills/SkillsManager';
import { getSessionData } from '@/lib/auth';
import HomePage from './HomePage/page';
import Skills from './Skills/page';
import Projects from './Projects/page';
import ServicesPage from './Services/page';
// import Skills from './Skills/page';
// import Projects from '@/components/layout/Projects';

export default async function Home() {
  return (
    <>
      <div className="flex flex-col gap-6 space-y-14">
      <HomePage/>
      <Skills/>
      <Projects/>
      <ServicesPage/>
      </div>
    </>
  );
}
