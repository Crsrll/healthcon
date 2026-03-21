import Link from 'next/link';
import GeneralCard from './GeneralCard';
export function ClinicCard({ clinic }) {
  return (
    <GeneralCard className="mb-4 border-t-4 border-t-[#19365d]">
      <h2 className="text-xl font-semibold"><Link href={`/clinics/${clinic.id}`}>{clinic.name}</Link></h2>
      <p className="text-gray-600">{clinic.city}</p>
      <p className="text-green-600 font-bold">{clinic.doctors} Doctors</p>
    </GeneralCard>
  );
}