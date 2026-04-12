'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useClinic } from '@/hooks/useClinic';
import { useDoctors } from '@/hooks/useDoctors';

// ── Reusable UI Components ──────────────────────────────────────
function InfoChip({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="text-[#3182ce]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-[#1a355d]">{title}</h2>
      {count !== undefined && (
        <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
          {count}
        </span>
      )}
    </div>
  );
}

export default function ClinicProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { clinic, loading: clinicLoading } = useClinic(params.clinicID);
  const { doctors, loading: doctorLoading} = useDoctors(params.clinicID);

  const isLoading = clinicLoading || doctorLoading;

  const [highlightDoctor, setHighlightDoctor] = useState(null);
  const doctorRefs = useRef({});

  // ── Smooth scroll + highlight ────────────────────────────────
  useEffect(() => {
    if (!clinic) return;

    const doctorID = searchParams.get('doctor');
    if (!doctorID) return;

    setHighlightDoctor(doctorID);

    const scrollTimer = setTimeout(() => {
      const target = doctorRefs.current[doctorID];
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 300);

    const highlightTimer = setTimeout(() => {
      setHighlightDoctor(null);
    }, 2000);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(highlightTimer);
    };
  }, [clinic, searchParams]);

  // ── Loading ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#1a355d] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading clinic profile...</p>
        </div>
      </div>
    );
  }

  // ── Not Found ────────────────────────────────────────────────
  if (!clinic) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-[#1a355d] mb-4">Clinic not found</p>
          <button 
            onClick={() => router.push('/clinics')}
            className="px-4 py-2 bg-[#1a355d] text-white rounded-lg text-sm"
          >
            Back to directory
          </button>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7fafc] pb-20">
      {/* ── HERO ── */}
      <div className="relative h-72 bg-[#1a355d] overflow-hidden">
        {clinic.image && (
          <img 
            src={clinic.image} 
            alt={clinic.clinicName}
            className="w-full h-full object-cover opacity-60" 
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#1a355d] via-[#1a355d]/40 to-transparent" />

        <button
          onClick={() => router.push('/clinics')}
          className="absolute top-6 left-6 bg-white/10 backdrop-blur-md text-white
                     text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2
                     hover:bg-white/20 transition-all border border-white/20"
        >
          <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to directory
        </button>

        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {(clinic.specialty ?? []).map(s => (
              <span key={s}
                className="text-xs font-bold bg-blue-400/20 text-blue-100
                           backdrop-blur-sm border border-blue-100/20 rounded-full px-3 py-1">
                {s}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-2">
            {clinic.clinicName}
          </h1>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            {clinic.address}
          </div>
        </div>
      </div>

      {/* ── QUICK INFO ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-8 py-4 flex flex-wrap gap-x-10 gap-y-3">
          <InfoChip icon="🕒" text={clinic.hours} />
          <InfoChip icon="📞" text={clinic.contact} />
          <InfoChip icon="✉️" text={clinic.email} />
          <InfoChip icon="📍" text={clinic.city} />
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* ABOUT */}
          <section>
            <SectionHeader title="About the Clinic" />
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <p className="text-gray-600 leading-relaxed">{clinic.about}</p>

              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
                {(clinic.amenities ?? []).map(a => (
                  <span key={a}
                    className="text-xs font-medium bg-gray-50 border border-gray-200
                               text-gray-500 rounded-lg px-3 py-1.5">
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* DOCTORS */}
          <section>
            <SectionHeader
              title="Medical Staff"
              count={`${doctors.length} Registered`}
            />

            <div className="flex flex-col gap-4">
              {doctors.map(doctor => (
                <div
                  key={doctor.id}
                  ref={el => (doctorRefs.current[doctor.id] = el)}
                  className={`bg-white rounded-2xl border p-5 flex items-center gap-5
                              transition-all duration-500
                              ${doctor.id === highlightDoctor
                                ? 'border-blue-500 ring-4 ring-blue-50 bg-blue-50/20 scale-[1.02]'
                                : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700
                                  flex items-center justify-center text-xl font-bold shrink-0">
                    {doctor.name?.split(' ').pop()?.[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">Dr. {doctor.name}</p>
                    <p className="text-sm text-blue-600 font-medium mb-1">
                      {doctor.specialty}
                    </p>
                    <p className="text-xs text-gray-400">
                      {doctor.schedule}
                    </p>
                  </div>

                  <button
                    disabled={!doctor.available}
                    className="shrink-0 bg-[#1a355d] hover:bg-blue-700 text-white
                               text-sm font-bold px-6 py-2.5 rounded-xl transition-all
                               disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed shadow-md"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="space-y-8">
          <section>
            <SectionHeader title="Services" />
            <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm">
              {(clinic.services ?? []).map((service, i) => (
                <div key={i} className="p-3">
                  {service}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}