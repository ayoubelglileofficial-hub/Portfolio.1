export const dynamic = 'force-dynamic'; // ← MUST be in the page file
export const revalidate = 0;              // ← MUST be in the page file

import Profil from '@/components/layout/Profil';

export default function Home() {
  return (
    <main>
      <Profil />
    </main>
  );
}



// import connectDB from "@/lib/mongodb";
// import Profile from "@/models/Profile";
// import ToggleProfile from "@/components/layout/Profil";

// export default async function Home() {
//     await connectDB();
//     const profil = await Profile.findOne({ _id: "prof_001" }).lean();

//     return (
//         <div className="flex flex-col flex-1 items-center justify-center w-full font-mono">
//             <div className="w-11/12 bg-muted/60 rounded-xl border border-zinc-200 p-8 flex flex-col items-center justify-center dark:border-transparent">
//                 {/* Toggle checkbox - controls visibility of profile content */}
//                 <ToggleProfile profil={profil} />
//             </div>
//         </div>
//     );
// }