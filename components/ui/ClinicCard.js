// import Link from 'next/link';

// import { Star, MapPin } from 'lucide-react';
// // import GeneralCard from './GeneralCard';

// export function ClinicCard({ clinic }) {

//   const specializations = Array.isArray(clinic.specialization)
//     ? clinic.specialization
//     : [clinic.specialization].filter(Boolean);

//   return (
//     <div className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden flex flex-col mb-8 mr-4">

//       {/* Image Section */}
//       <div className="relative h-48 overflow-hidden">
//         <img
//           src={clinic.image}
//           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//           alt={clinic.name}
//         />
//         <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

//         {/* Status Badge */}
//         <div className="absolute top-4 left-4">
//           <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-teal-500 text-white">
//             Open
//           </span>
//         </div>

//         {/* Doctor Count Badge */}
//         <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-2xl">
//           <span className="text-white text-[10px] font-black">{clinic.doctorCount} Doctors</span>
//         </div>

//         {/* Bottom Info Overlay */}
//         <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
//           <div>
//             <p className="text-teal-400 text-[10px] font-black uppercase tracking-widest mb-1">
//               {specializations[0]}
//             </p>
//             <h3 className="text-white font-bold text-lg leading-tight">{clinic.name}</h3>
//           </div>
//           <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
//             <Star size={12} className="fill-amber-400 text-amber-400" />
//             <span className="text-white text-xs font-black">4.8</span>
//           </div>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="p-6 space-y-4 flex-1 flex flex-col">
//         <div className="flex items-center gap-2 text-slate-500">
//           <MapPin size={14} className="text-teal-500" />
//           <span className="text-xs font-bold uppercase tracking-tight">{clinic.location}</span>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {specializations.map(s => (
//             <span key={s} className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
//               {s}
//             </span>
//           ))}
//         </div>

//         <div className="pt-2 mt-auto">
//           <Link
//             href={`/clinics/${clinic.id}`}
//             className="block w-full bg-[#1a365d] hover:bg-blue-800 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center transition-all shadow-lg shadow-blue-900/10 active:scale-95"
//           >
//             Book Appointment
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

export function ClinicCard({ clinic }) {
  const specializations = Array.isArray(clinic.specialization)
    ? clinic.specialization
    : [clinic.specialization].filter(Boolean);

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:-translate-y-px hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-200">

      {/* Image */}
      <div className="relative h-38 overflow-hidden flex-shrink-0 bg-slate-200">
        <img
          src={clinic.image}
          alt={clinic.name}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-400"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2342]/80 via-[#0f2342]/10 to-transparent" />

        {/* Badges */}
        <span className="absolute top-2.5 left-2.5 bg-teal-700 text-white text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded">
          Open
        </span>
        <span className="absolute top-2.5 right-2.5 bg-white/10 border border-white/20 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded">
          {clinic.doctorCount} Doctors
        </span>

        {/* Name + location on image */}
        <div className="absolute bottom-0 left-0 right-0 px-3.5 pb-3">
          <h3 className="text-white font-bold text-[13px] leading-snug tracking-tight">
            {clinic.name}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={10} className="text-white/50 flex-shrink-0" />
            <span className="text-white/60 text-[11px]">{clinic.location}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-3.5 pt-3 pb-3.5 flex flex-col gap-2.5 flex-1">

        {/* Specialty tags */}
        <div className="flex flex-wrap gap-1.5">
          {specializations.map(s => (
            <span
              key={s}
              className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="border-t border-slate-100" />

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-amber-800">4.8</span>
          </div>
          <span className="text-[11px] text-slate-400">Verified Clinic</span>
        </div>

        {/* CTA */}
        <Link
          href={`/clinics/${clinic.id}`}
          className="block w-full bg-[#1a355d] hover:bg-[#234876] active:scale-[0.98] text-white text-center text-[11px] font-bold uppercase tracking-widest py-2.5 rounded-lg transition-all"
        >
          Book Appointment
        </Link>

      </div>
    </div>
  );
}