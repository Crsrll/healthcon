import Link from 'next/link';
import GeneralCard from './GeneralCard';
export function ClinicCard({ clinic }) {
  return (
    <GeneralCard className="mb-4 border-t-4 border-t-[#19365d]">
      <div className="relative h-40 bg-[#1a355d] overflow-hidden">
        {clinic.image ? (
          <img
            src={clinic.image}
            alt={clinic.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#1a355d] to-[#2a4a7f]
                          flex items-center justify-center">
            <span className="text-4xl font-bold text-healthcon-teal/30">
              {clinic.name[0]}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#1a355d]/70 to-transparent" />

        <div className="absolute top-3 left-3 bg-[#1a355d]/80 backdrop-blur-sm
                        rounded-lg px-2.5 py-1 text-xs font-semibold text-healthcon-teal">
          {clinic.specialty}
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 border border-white" />
          <span className="text-xs font-semibold text-white">
            {clinic.doctors} doctor{clinic.doctors > 1 ? 's' : ''} available
          </span>
        </div>
      </div>
      <h2 className="text-medium font-semibold pt-3"><Link href={`/clinics/${clinic.id}`}>{clinic.name}</Link></h2>
      <p className="text-gray-600">{clinic.city}</p>
    </GeneralCard>
  );
}