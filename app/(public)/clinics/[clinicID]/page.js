'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';

const DUMMY_CLINICS = [
  {
    id: '1',
    name: 'CDO General Outpatient Clinic',
    location: 'Cagayan de Oro',
    address: 'Corrales Ave, Cagayan de Oro City, Misamis Oriental',
    status: 'approved',
    specialization: ['General Practice', 'Pediatrics'],
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
    about: 'A trusted outpatient facility serving Cagayan de Oro and surrounding areas since 2005. We provide comprehensive healthcare services with a focus on accessible, patient-centered care for all ages.',
    hours: 'Mon–Sat, 8:00 AM – 5:00 PM',
    contact: '(088) 123-4567',
    email: 'cdogeneral@healthcon.ph',
    services: [
      'General Consultation',
      'Pediatric Check-up',
      'Vaccination',
      'Laboratory Services',
      'Minor Surgery',
      'Prenatal Care',
    ],
    amenities: ['Wheelchair Access', 'Parking', 'Air Conditioned', 'Pharmacy Nearby'],
    doctorCount: 3,
  },
  {
    id: '2',
    name: 'Iligan City Medical Center',
    location: 'Iligan City',
    address: 'Gen. Aguinaldo St, Iligan City, Lanao del Norte',
    status: 'approved',
    specialization: ['Internal Medicine', 'Cardiology'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    about: 'Full-service medical center offering specialist consultations and advanced diagnostics. Our team of experienced physicians is dedicated to providing evidence-based care.',
    hours: 'Mon–Fri, 7:00 AM – 6:00 PM',
    contact: '(063) 456-7890',
    email: 'iliganmedical@healthcon.ph',
    services: [
      'Internal Medicine Consultation',
      'Cardiology Workup',
      'ECG / 2D Echo',
      'Stress Test',
      'Holter Monitoring',
      'Dietary Consultation',
    ],
    amenities: ['24/7 Emergency', 'ICU', 'Parking', 'Pharmacy On-site'],
    doctorCount: 5,
  },
];

const DUMMY_DOCTORS = [
  { id: '1', name: 'Dr. Rosa Macaraeg',  specialization: 'General Practice',  clinicID: '1', available: true,  queue: 7,  schedule: 'Mon, Wed, Fri — 9AM to 12PM' },
  { id: '2', name: 'Dr. Jun Dela Cruz',  specialization: 'Pediatrics',        clinicID: '1', available: true,  queue: 3,  schedule: 'Tue, Thu, Sat — 1PM to 5PM'  },
  { id: '3', name: 'Dr. Sofia Castillo', specialization: 'Internal Medicine',  clinicID: '2', available: false, queue: 0,  schedule: 'Mon to Fri — 8AM to 12PM'    },
  { id: '4', name: 'Dr. Marco Reyes',    specialization: 'Cardiology',         clinicID: '2', available: true,  queue: 2,  schedule: 'Mon, Wed — 2PM to 6PM'       },
];

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
  const params       = useParams();
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [clinic,   setClinic]   = useState(null);
  const [doctors,  setDoctors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [highlightDoctor, setHighlightDoctor] = useState(null);

  const doctorRefs = useRef({});

  useEffect(() => {
    const doctorID = searchParams.get('doctor');
  
    if (!doctorID) return;
  
    setHighlightDoctor(doctorID);
  
    const timer = setTimeout(() => {
      setHighlightDoctor(null);
    }, 2000);
  
    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    if (!params?.clinicID) return;

    const clinicId = params.clinicID;
    const doctorID = searchParams.get('doctor') || '';

    const foundClinic  = DUMMY_CLINICS.find(c => c.id === clinicId);
    const foundDoctors = DUMMY_DOCTORS.filter(d => d.clinicID === clinicId);

    if (!foundClinic) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setClinic(foundClinic);
    setDoctors(foundDoctors);
    setLoading(false);

    // Smooth scroll to specific doctor if ID is in URL
    if (doctorID) {
      setTimeout(() => {
        const target = doctorRefs.current[doctorID];
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [params, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#1a355d] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading clinic profile...</p>
        </div>
      </div>
    );
  }

  if (notFound || !clinic) {
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

  const activeDoctorID = searchParams.get('doctor');

  return (
    <div className="min-h-screen bg-[#f7fafc] pb-20">
      {/* ── HERO ── */}
      <div className="relative h-72 bg-[#1a355d] overflow-hidden">
        {clinic.image && (
          <img 
            src={clinic.image} 
            alt={clinic.name}
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
            {clinic.specialization.map(s => (
              <span key={s}
                className="text-xs font-bold bg-blue-400/20 text-blue-100
                           backdrop-blur-sm border border-blue-100/20 rounded-full px-3 py-1">
                {s}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-2">
            {clinic.name}
          </h1>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {clinic.address}
          </div>
        </div>
      </div>

      {/* ── QUICK INFO STRIP ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-8 py-4 flex flex-wrap gap-x-10 gap-y-3">
          <InfoChip icon="🕒" text={clinic.hours} />
          <InfoChip icon="📞" text={clinic.contact} />
          <InfoChip icon="✉️" text={clinic.email} />
          <InfoChip icon="📍" text={clinic.location} />
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* ABOUT */}
          <section>
            <SectionHeader title="About the Clinic" />
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <p className="text-gray-600 leading-relaxed">{clinic.about}</p>
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
                {clinic.amenities.map(a => (
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
                    {doctor.name.split(' ').pop()?.[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-blue-600 font-medium mb-1">
                      {doctor.specialization}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       {doctor.schedule}
                    </p>
                  </div>

                  <div className="text-right shrink-0 px-4 border-x border-gray-100 hidden sm:block">
                    {doctor.available ? (
                      <div>
                        <div className="flex items-center gap-1.5 justify-end mb-1 text-green-600">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-xs font-bold uppercase tracking-wider">Available</span>
                        </div>
                        <p className="text-xs text-gray-500">{doctor.queue} in line</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">Off-duty</span>
                      </div>
                    )}
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

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          {/* SERVICES */}
          <section>
            <SectionHeader title="Services" />
            <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm">
              {clinic.services.map((service, i) => (
                <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 stroke-blue-600 fill-none stroke-2" viewBox="0 0 24 24">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </section>

          {/* LOCATION CARD */}
          <section>
            <SectionHeader title="Location" />
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1a355d 1px, transparent 1px)', size: '20px 20px' }} />
                <div className="text-center relative z-10">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-gray-600">Map View</p>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm font-bold text-gray-900 mb-1">{clinic.address}</p>
                <p className="text-xs text-gray-500 mb-4">{clinic.location}</p>
                
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name + ' ' + clinic.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gray-900 hover:bg-black text-white text-xs
                             font-bold py-3 rounded-xl transition-colors
                             flex items-center justify-center gap-2 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in Google Maps
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}