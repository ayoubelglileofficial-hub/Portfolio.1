import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import Profile from "@/models/Profile";
import ServiceCard from "@/components/ServiceCard";

interface ServicesProps {
  hidden?: boolean;
  isAdmin?: boolean;
}

export default async function Services({ hidden, isAdmin }: ServicesProps) {
  await connectDB();
  const services = await Service.find().sort({ order_index: 1 }).lean();
  const profil = await Profile.findOne({ _id: 'prof_001' }).lean();
  const phone = profil?.phone ? String(profil.phone) : '';

  if (!services || services.length === 0) return null;
  if (hidden && !isAdmin) return null;

  const preview = hidden && isAdmin;
  const visible = isAdmin ? services : services.filter((s) => s.isVisible);

  if (visible.length === 0) return null;

  return (
    <section id="services" className="flex flex-col items-center w-full font-mono scroll-mt-20">
      <div className={`w-11/12 rounded-xl border p-8 ${preview ? 'bg-red-500/5 border-red-200 dark:border-red-900/50' : 'bg-muted/60 border-zinc-200 dark:border-transparent'}`}>
        <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl font-bold ${preview ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>
            {preview ? 'Services (Hidden)' : 'Services'}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            What I offer
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mx-auto">
          {visible.map((service) => (
            <div key={service._id} className="flex justify-center sm:block">
              <div className="w-[85%] sm:w-full ">
                <ServiceCard
                  service={{
                    ...service,
                    _id: String(service._id),
                    created_at: service.created_at?.toISOString?.() ?? '',
                    updated_at: service.updated_at?.toISOString?.() ?? '',
                  }}
                  phone={phone}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
