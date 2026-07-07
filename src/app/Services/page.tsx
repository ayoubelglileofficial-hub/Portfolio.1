export const dynamic = 'force-dynamic';
export const revalidate = 0;

import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { getSessionData } from '@/lib/auth';
import Services from '@/components/layout/Services';
import ServicesManager from '@/components/layout/ServicesManager';
import ServicesVisibilityToggle from '@/components/layout/ServicesVisibilityToggle';

export default async function ServicesPage() {
  await connectDB();
  const profil = await Profile.findOne({ _id: 'prof_001' }).lean();
  const showServices = profil
    ? profil.show_services === true || profil.show_services === 'true'
    : true;

  const session = await getSessionData();
  const isAdmin = session?.role === 'admin';

  return (
    <main>
      <div className="flex flex-col gap-6">
        {isAdmin && (
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center gap-3">
              <ServicesVisibilityToggle
                key={String(showServices)}
                initialValue={showServices}
              />
              <ServicesManager />
            </div>
          </div>
        )}

        <Services hidden={!showServices} isAdmin={isAdmin} />
      </div>
    </main>
  );
}
