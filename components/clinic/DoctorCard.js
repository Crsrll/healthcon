'use client';
import { useRouter } from 'next/navigation';

const AVATAR_COLORS = [
  'bg-[#ebf8ff] text-[#2b6cb0]',
  'bg-[#e6fffa] text-[#234e52]',
  'bg-[#faf5ff] text-[#553c9a]',
  'bg-[#fff5f5] text-[#9b2c2c]',
];

// Helper to get a consistent number from a string ID (e.g., "doc1")
const getIDHash = (id) => {
  if (!id) return 0;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export function DoctorCard({ doctor, clinic }) {
  const router = useRouter();

  // FIX: Use the hash helper instead of parseInt to prevent NaN colors
  const hashValue = getIDHash(doctor.id || '1');
  const colorClass = AVATAR_COLORS[hashValue % AVATAR_COLORS.length];

  function handleClick() {
    // Navigates to the specific clinic and passes the doctor ID in the URL
    router.push(`/clinics/${doctor.clinicID}?doctor=${doctor.id}`);
  }

  // Helper for the avatar initial
  const getInitial = () => {
    if (!doctor?.name) return '?';
    const names = doctor.name.split(' ');
    // If name is "Dr. Ben Villanueva", it looks for the part after "Dr."
    const namePart = names.find(n => !n.includes('.') && n.toLowerCase() !== 'dr') || names[0];
    return namePart[0].toUpperCase();
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden
                 cursor-pointer transition-all hover:-translate-y-1
                 hover:border-[#3182ce] hover:shadow-lg flex flex-col group"
    >
      <div className="h-1.5 bg-[#3182ce]" />

      <div className="px-5 pt-5 pb-3 flex items-center gap-4">
        {/* Avatar with fixed color logic */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                         text-xl font-bold shrink-0 transition-transform group-hover:scale-110 ${colorClass}`}>
          {getInitial()}
        </div>
        
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#1a355d] leading-snug truncate">
            {doctor?.name?.startsWith('Dr') ? doctor.name : `Dr. ${doctor?.name ?? '?'}`}
          </h3>
          <p className="text-xs text-[#3182ce] font-medium mt-0.5">
            {/* Matches the 'specialty' field in your database */}
            {doctor?.specialty ?? 'General Physician'}
          </p>
        </div>
      </div>

      <div className="px-5 pb-4 flex-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="w-3 h-3 shrink-0 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="truncate">{clinic?.clinicName || 'Clinic Location'}</span>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-slate-50/30">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">View Profile</span>
        <svg className="w-4 h-4 stroke-[#3182ce] fill-none stroke-2 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
  );
}