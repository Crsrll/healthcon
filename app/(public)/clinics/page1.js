'use client';
import FilterSidebar from '@/components/layout/FilterSidebar';
import { ClinicCard } from '@/components/ui/ClinicCard';
import { DoctorCard } from '@/components/clinic/DoctorCard';
import { useState, useEffect } from 'react';

// ── Dummy data — matches your group's agreed Firestore shape ──
const DUMMY_CLINICS = [
  { id: '1',  name: 'Melissa General Outpatient Clinic', location: 'Cagayan de Oro',
    status: 'approved', specialization: ['General Practice', 'Pediatrics'],
    doctorCount: 3,
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80' },

  { id: '2',  name: 'Jade Kyll Medical Center',    location: 'Iligan City',
    status: 'approved', specialization: ['Internal Medicine', 'Cardiology'],
    doctorCount: 5,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80' },

  { id: '3',  name: 'Judel Community Health',     location: 'Malaybalay',
    status: 'approved', specialization: ['General Practice'],
    doctorCount: 1,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80' },

  { id: '4',  name: 'Nova Community Health',         location: 'Dapitan',
    status: 'approved', specialization: ['General Practice', 'Pediatrics'],
    doctorCount: 4,
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&q=80' },

  { id: '5',  name: 'Joseph Community Health',       location: 'Dapitan',
    status: 'approved', specialization: ['Internal Medicine'],
    doctorCount: 6,
    image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=600&q=80' },

  { id: '6',  name: 'Che Ann Community Health',      location: 'Dapitan',
    status: 'approved', specialization: ['Ob-Gyne', 'General Practice'],
    doctorCount: 7,
    image: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=600&q=80' },

  { id: '7',  name: 'Sheila Community Health',       location: 'Dapitan',
    status: 'approved', specialization: ['General Practice'],
    doctorCount: 6,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80' },

  { id: '8',  name: 'Xhyndy Community Health',       location: 'Dapitan',
    status: 'approved', specialization: ['Internal Medicine', 'Pediatrics'],
    doctorCount: 9,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80' },

  { id: '9',  name: 'Jashtenne Community Health',    location: 'Dapitan',
    status: 'approved', specialization: ['General Practice', 'Ob-Gyne'],
    doctorCount: 11,
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80' },
];

const DUMMY_DOCTORS = [
  { id: '1',  name: 'Dr. Rosa Macaraeg',    specialization: 'General Practice', clinicID: '1', clinicName: 'CDO General Outpatient Clinic'},
  { id: '2',  name: 'Dr. Jun Dela Cruz',     specialization: 'Pediatrics',       clinicID: '1', clinicName: 'CDO General Outpatient Clinic' },
  { id: '3',  name: 'Dr. Sofia Castillo',    specialization: 'Internal Medicine', clinicID: '2', clinicName: 'Iligan City Medical Center' },
  { id: '4',  name: 'Dr. Marco Reyes',       specialization: 'Cardiology',        clinicID: '2', clinicName: 'Iligan City Medical Center' },
  { id: '5',  name: 'Dr. Ana Santos',        specialization: 'General Practice',  clinicID: '3', clinicName: 'Bukidnon Community Health' },
  { id: '6',  name: 'Dr. Lena Cruz',         specialization: 'Pediatrics',        clinicID: '4', clinicName: 'Nova Community Health' },
  { id: '7',  name: 'Dr. Ben Villanueva',    specialization: 'Internal Medicine', clinicID: '5', clinicName: 'Joseph Community Health' },
  { id: '8',  name: 'Dr. Claire Mendoza',    specialization: 'Ob-Gyne',           clinicID: '6', clinicName: 'Che Ann Community Health' },
  { id: '9',  name: 'Dr. Paolo Gutierrez',   specialization: 'General Practice',  clinicID: '7', clinicName: 'Sheila Community Health' },
  { id: '10', name: 'Dr. Mia Fernandez',     specialization: 'Internal Medicine', clinicID: '8', clinicName: 'Xhyndy Community Health' },
  { id: '11', name: 'Dr. James Ramos',       specialization: 'Pediatrics',        clinicID: '8', clinicName: 'Xhyndy Community Health' },
  { id: '12', name: 'Dr. Tina Navarro',      specialization: 'Ob-Gyne',           clinicID: '9', clinicName: 'Jashtenne Community Health' },
];

const SPECIALTIES = ['All', 'General Practice', 'Pediatrics', 'Internal Medicine', 'Ob-Gyne', 'Cardiology'];
const CITIES      = ['All cities', 'Cagayan de Oro', 'Iligan City', 'Dapitan', 'Malaybalay'];

export default function ClinicDirectory() {
  const [mode,            setMode]            = useState('clinics'); // 'clinics' | 'doctors'
  const [search,          setSearch]          = useState('');
  const [specialty,       setSpecialty]       = useState('All');
  const [city,            setCity]            = useState('All cities');
  const [results,         setResults]         = useState([]);
  const [loading,         setLoading]         = useState(true);

  // ── Load data on mount ──
  useEffect(() => {
    setLoading(false);
  }, []);

  // ── Filter whenever mode, search, specialty, or city changes ──
  useEffect(() => {
    const q = search.toLowerCase();

    if (mode === 'clinics') {
      setResults(
        DUMMY_CLINICS.filter(c => {
          // only show approved clinics — matches your Firestore status field
          if (c.status !== 'approved') return false;

          const matchSearch    = c.name.toLowerCase().includes(q) ||
                                 c.location.toLowerCase().includes(q);

          // specialization is an array — use .includes() like Firestore array-contains
          const matchSpecialty = specialty === 'All' ||
                                 c.specialization.includes(specialty);

          const matchCity      = city === 'All cities' || c.location === city;

          return matchSearch && matchSpecialty && matchCity;
        })
      );
    } else {
      setResults(
        DUMMY_DOCTORS.filter(d => {
          const matchSearch    = d.name.toLowerCase().includes(q) ||
                                 d.specialization.toLowerCase().includes(q) ||
                                 d.clinicName.toLowerCase().includes(q);

          const matchSpecialty = specialty === 'All' ||
                                 d.specialization === specialty;

          // filter doctors by their clinic's city — needs clinicLocation in real data
          // for now city filter is skipped for doctors (add when Firebase connected)
          const matchCity      = city === 'All cities';

          return matchSearch && matchSpecialty && matchCity;
        })
      );
    }
  }, [mode, search, specialty, city]);

  function resetFilters() {
    setSearch('');
    setSpecialty('All');
    setCity('All cities');
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setSearch('');
    setSpecialty('All');
    setCity('All cities');
  }

  const label = mode === 'clinics'
    ? `${results.length} clinic${results.length !== 1 ? 's' : ''}`
    : `${results.length} doctor${results.length !== 1 ? 's' : ''}`;

  return (
    <div className="min-h-screen bg-[#f7fafc]">

      {/* ── Hero ── */}
      <div className="bg-[#1a355d] px-8 py-8">
        <p className="text-healthcon-teal font-semibold uppercase text-xs tracking-widest mb-2">
          Mindanao · Verified Clinics
        </p>
        <h1 className="text-3xl text-[#f7fafc] font-bold mb-2">
          {mode === 'clinics' ? 'Find a Clinic Near You' : 'Find a Doctor'}
        </h1>
        <p className="text-[#f7fafc]/60 mb-6 max-w-md text-sm">
          {mode === 'clinics'
            ? 'Browse verified clinics across Mindanao.'
            : 'Search doctors by name or specialization.'}
        </p>

        <div className="flex gap-2 max-w-lg">
          <input
            type="text"
            placeholder={
              mode === 'clinics'
                ? 'Search by clinic name or city...'
                : 'Search by doctor name or specialization...'
            }
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5
                       text-white placeholder-white/40 text-sm outline-none
                       focus:border-healthcon-teal/50 focus:bg-white/15 transition-all"
          />
          <button className="bg-[#3182ce] hover:bg-[#2b6cb0] text-white font-semibold
                             text-sm px-5 py-2.5 rounded-xl transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex items-start">

        {/* ── Sidebar ── */}
        <FilterSidebar
          mode={mode}
          onModeChange={handleModeChange}
          specialty={specialty}
          onSpecialtyChange={setSpecialty}
          city={city}
          onCityChange={setCity}
          onReset={resetFilters}
          SPECIALTIES={SPECIALTIES}
          CITIES={CITIES}
        />

        {/* ── Main ── */}
        <main className="flex-1 p-6 min-w-0">

          {/* Result count + sort */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-[#1a355d]">{label}</span>
            </p>
            <select className="text-xs border border-gray-200 rounded-lg px-3 py-2
                               text-gray-600 bg-white outline-none cursor-pointer
                               focus:border-[#3182ce] transition-colors">
              <option>Sort: Name A–Z</option>
              <option>Sort: Most doctors</option>
            </select>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100
                                        overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#ebf8ff] flex items-center
                              justify-center mb-4">
                <svg className="w-6 h-6 stroke-[#3182ce] fill-none stroke-2"
                     viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <p className="font-semibold text-[#1a355d] mb-1">
                No {mode} found
              </p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              <button
                onClick={resetFilters}
                className="mt-4 text-sm text-[#3182ce] font-medium hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}

          {/* Grid — switches between clinic cards and doctor cards */}
          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mode === 'clinics'
                ? results.map(clinic => (
                    <ClinicCard key={clinic.id} clinic={clinic} />
                  ))
                : results.map(doctor => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))
              }
            </div>
          )}

        </main>
      </div>
    </div>
  );
}