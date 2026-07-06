export const dynamic = 'force-dynamic';
export const revalidate = 0;

import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Profil from '@/components/layout/Profil';
import ProfileVisibilityToggle from '@/components/ProfileVisibilityToggle';
import ProfileForm from '@/components/layout/ProfileModal';
import { getSessionData } from '@/lib/auth';
import HomePage from './HomePage/page';
import Skills from './Skills/page';
import Projects from './Projects/page';
import ServicesPage from './Services/page';
import ContactSection from '@/components/layout/ContactSection';

export default async function Home() {
  await connectDB();
  const profil = await Profile.findOne({ _id: 'prof_001' }).lean();

  return (
    <>
      <div className="flex flex-col gap-6 space-y-14">
        <HomePage/>
        <Skills/>
        <Projects/>
        <ServicesPage/>
        {profil && (
          <ContactSection
            email={String(profil.email || '')}
            phone={String(profil.phone || '')}
            location={String(profil.location || '')}
            githubUrl={String(profil.github_url || '#')}
            linkedinUrl={String(profil.linkedin_url || '#')}
          />
        )}
      </div>
    </>
  );
}
