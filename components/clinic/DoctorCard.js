'use client';
import { useRouter } from 'next/navigation';

const AVATAR_COLORS = [
  'bg-[#ebf8ff] text-[#2b6cb0]',
  'bg-[#e6fffa] text-[#234e52]',
  'bg-[#faf5ff] text-[#553c9a]',
  'bg-[#fff5f5] text-[#9b2c2c]',
];

export function DoctorCard({ doctor }) {
  const router = useRouter();

  // Pick a consistent color based on doctor id
  const colorClass = AVATAR_COLORS[parseInt(doctor.id) % AVATAR_COLORS.length];

  function handleClick() {
    // URL format your group decided: /clinic/[clinicId]?doctor=[doctorId]
    router.push(`/clinics/${doctor.clinicID}?doctor=${doctor.id}`);
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden
                 cursor-pointer transition-all hover:-translate-y-1
                 hover:border-[#3182ce] hover:shadow-lg flex flex-col"
    >
      {/* Top color strip */}
      <div className="h-1.5 bg-[#3182ce]" />

      {/* Avatar section */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                         text-xl font-bold shrink-0 ${colorClass}`}>
          {doctor.name.split(' ').find(w => w.startsWith('Dr'))
            ? doctor.name.split(' ')[1]?.[0] ?? doctor.name[0]
            : doctor.name[0]}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#1a355d] leading-snug truncate">
            {doctor.name}
          </h3>
          <p className="text-xs text-[#3182ce] font-medium mt-0.5">
            {doctor.specialization}
          </p>
        </div>
      </div>

      {/* Clinic name */}
      <div className="px-5 pb-4 flex-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="w-3 h-3 shrink-0 fill-none stroke-current stroke-2"
               viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="truncate">{doctor.clinicName}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
        <span className="text-xs text-gray-400">View at clinic</span>
        <svg className="w-4 h-4 stroke-[#3182ce] fill-none stroke-2" viewBox="0 0 24 24">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
  );
}