export const dynamic = 'force-dynamic';
export const revalidate = 0;

import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { getSessionData } from '@/lib/auth';
import ExperienceSection from '@/components/layout/Experience/ExperienceSection';
import ExperienceAdminList from '@/components/layout/Experience/ExperienceAdminList';
import ExperienceVisibilityToggle from '@/components/layout/Experience/ExperienceVisibilityToggle';
import EducationSection from '@/components/layout/Education/EducationSection';
import EducationAdminList from '@/components/layout/Education/EducationAdminList';
import EducationVisibilityToggle from '@/components/layout/Education/EducationVisibilityToggle';
import CertificationSection from '@/components/layout/Certification/CertificationSection';
import CertificationAdminList from '@/components/layout/Certification/CertificationAdminList';
import CertificationVisibilityToggle from '@/components/layout/Certification/CertificationVisibilityToggle';

export default async function About() {
  return (
    <main className="flex flex-col gap-6">
      <Experience/>
      <Certification/>
      <Education/>
    </main>
  );
}


async function Experience() {
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

async function Certification() {
  await connectDB();
  const profil = await Profile.findOne({ _id: 'prof_001' }).lean();
  const showCertification = profil
    ? profil.show_certification === true || profil.show_certification === 'true'
    : true;

  const session = await getSessionData();
  const isAdmin = session?.role === 'admin';

  return (
    <main>
      <div className="flex flex-col gap-6">
        {isAdmin && (
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center gap-3">
              <CertificationVisibilityToggle
                key={String(showCertification)}
                initialValue={showCertification}
              />
              <CertificationAdminList />
            </div>
          </div>
        )}

        <CertificationSection hidden={!showCertification} isAdmin={isAdmin} />
      </div>
    </main>
  );
}

async function Education() {
  await connectDB();
  const profil = await Profile.findOne({ _id: 'prof_001' }).lean();
  const showEducation = profil
    ? profil.show_education === true || profil.show_education === 'true'
    : true;

  const session = await getSessionData();
  const isAdmin = session?.role === 'admin';

  return (
    <main>
      <div className="flex flex-col gap-6">
        {isAdmin && (
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center gap-3">
              <EducationVisibilityToggle
                key={String(showEducation)}
                initialValue={showEducation}
              />
              <EducationAdminList />
            </div>
          </div>
        )}

        <EducationSection hidden={!showEducation} isAdmin={isAdmin} />
      </div>
    </main>
  );
}

