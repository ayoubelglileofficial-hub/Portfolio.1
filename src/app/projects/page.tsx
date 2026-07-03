export const dynamic = 'force-dynamic';
export const revalidate = 0;

import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { getSessionData } from '@/lib/auth';
import ProjectsSection from '@/components/layout/Projects/ProjectsSection';
import ProjectsManager from '@/components/layout/Projects/ProjectsManager';
import ProjectsVisibilityToggle from '@/components/layout/Projects/ProjectsVisibilityToggle';

export default async function Projects() {
  await connectDB();
  const profil = await Profile.findOne({ _id: 'prof_001' }).lean();
  const showProjects = profil
    ? profil.show_projects === true || profil.show_projects === 'true'
    : true;

  const session = await getSessionData();
  const isAdmin = session?.role === 'admin';

  return (
    <main>
      <div className="flex flex-col gap-6">
        {isAdmin && (
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center gap-3">
              <ProjectsVisibilityToggle
                key={String(showProjects)}
                initialValue={showProjects}
              />
              <ProjectsManager />
            </div>
          </div>
        )}

        <ProjectsSection hidden={!showProjects} isAdmin={isAdmin} />
      </div>
    </main>
  );
}
