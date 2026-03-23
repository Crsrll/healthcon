'use client';
import FilterSection from '@/components/layout/FilterSidebar';
import {ClinicCard} from '@/components/ui/ClinicCard';
import { useState, useEffect } from 'react';

export default function ClinicDirectory() {
  const [clinics,         setClinics]         = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [search,          setSearch]          = useState('');
  const [specialty,       setSpecialty]       = useState('All');
  const [city,            setCity]            = useState('All cities');
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    const dummy = [
        { id: '1',  name: 'CDO General Outpatient Clinic', city: 'Cagayan de Oro', doctors: 3,  specialty: 'Ob-Gyne',
          image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80' },
      
        { id: '2',  name: 'Iligan City Medical Center',    city: 'Iligan City',    doctors: 5,  specialty: 'Cardiology',
          image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80' },
      
        { id: '3',  name: 'Bukidnon Community Health',     city: 'Malaybalay',     doctors: 1,  specialty: 'General Practice',
          image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80' },
      
        { id: '4',  name: 'Nova Community Health',         city: 'Dapitan City',        doctors: 4,  specialty: 'Pediatrics',
          image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&q=80' },
      
        { id: '5',  name: 'Joseph Community Health',       city: 'Dipolog City',        doctors: 6,  specialty: 'Internal Medicine',
          image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=600&q=80' },
      
        { id: '6',  name: 'Che Ann Community Health',      city: 'Polanco, Dipolog City',        doctors: 7,  specialty: 'Ob-Gyne',
          image: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=600&q=80' },
      
        { id: '7',  name: 'Sheila Community Health',       city: 'Dapitan City',        doctors: 9,  specialty: 'Internal Medicine',
          image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80' },
      
        { id: '8',  name: 'Jashtenne Community Health',    city: 'Dapitan City',        doctors: 11, specialty: 'Cardiology',
          image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80' },
      
        { id: '9', name: 'Judel Community Health',        city: 'Sibutad City',        doctors: 9,  specialty: 'Pediatrics',
          image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80' },
      
        { id: '10', name: 'Leo Community Health',          city: 'Rizal City',        doctors: 6,  specialty: 'General Practice',
          image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80' },
      
        { id: '11', name: 'Jade Community Health',         city: 'Roxas City',        doctors: 6,  specialty: 'Ob-Gyne',
          image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80' },
        {
            id: '12', name: 'Melissa Community Health',        city: 'Gudodaismo',        doctors: 3,  specialty: 'Pediatrics', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80'
        },
        {
            id: '13', name: 'Xhyndy Community Health',     city: 'Manoquack City',        doctors: 4,  specialty: 'Internal Medicine', image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80'
        },
      ];
    setClinics(dummy);
    setFilteredClinics(dummy);
    setLoading(false);
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredClinics(
      clinics.filter(c => {
        const matchSearch    = c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
        const matchSpecialty = specialty === 'All' || c.specialty === specialty;
        const matchCity      = city === 'All cities' || c.city === city;
        return matchSearch && matchSpecialty && matchCity;
      })
    );
  }, [search, specialty, city, clinics]);

  function resetFilters() {
    setSearch('');
    setSpecialty('All');
    setCity('All cities');
  }

  const SPECIALTIES = ['All', 'General Practice', 'Pediatrics', 'Internal Medicine', 'Ob-Gyne', 'Cardiology'];
  const CITIES      = ['All cities', 'Cagayan de Oro', 'Iligan City', 'Dapitan', 'Malaybalay'];

  return (
    <div className="min-h-screen bg-[#f7fafc]">

      {/* ── HERO ── */}
      <div className="bg-[#1a355d] px-8 py-8">
        <p className="text-healthcon-teal font-semibold uppercase text-xs tracking-widest mb-2">
          Mindanao · Verified Clinics
        </p>
        <h1 className="text-3xl text-[#f7fafc] font-bold mb-2">
          Find a Clinic Near You
        </h1>
        <p className="text-[#f7fafc]/60 mb-6 max-w-md text-sm">
          Browse verified clinics across Mindanao. See real-time doctor availability before you travel.
        </p>
        <div className="flex gap-2 max-w-lg">
          <input
            type="text"
            placeholder="Search by clinic name or city..."
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

      {/* ── BODY: sidebar + grid ── */}
      <div className="flex items-start">

        {/* ── SIDEBAR ── sticky, full height, scrollable */}
        <aside className="w-56 shrink-0 sticky top-0 h-[calc(100vh-0px)]
                          overflow-y-auto bg-white border-r border-gray-200 p-4">

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Filters
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-[#3182ce] hover:underline font-medium"
            >
              Reset all
            </button>
          </div>

          <FilterSection title="Specialty" hasActive={specialty !== 'All'}>
            {SPECIALTIES.map(s => (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={`w-full text-left flex items-center gap-2 px-2 py-2
                            rounded-lg text-sm transition-colors mb-0.5
                            ${specialty === s
                              ? 'bg-blue-50 text-[#1a355d] font-medium'
                              : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border shrink-0 transition-all
                                  ${specialty === s
                                    ? 'border-[#1a355d] bg-[#1a355d]'
                                    : 'border-gray-300'}`}
                />
                {s}
              </button>
            ))}
          </FilterSection>

          <FilterSection title="Location" hasActive={city !== 'All cities'}>
            {CITIES.map(c => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`w-full text-left flex items-center gap-2 px-2 py-2
                            rounded-lg text-sm transition-colors mb-0.5
                            ${city === c
                              ? 'bg-blue-50 text-[#1a355d] font-medium'
                              : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border shrink-0 transition-all
                                  ${city === c
                                    ? 'border-[#1a355d] bg-[#1a355d]'
                                    : 'border-gray-300'}`}
                />
                {c}
              </button>
            ))}
          </FilterSection>

        </aside>

        {/* ── MAIN GRID ── */}
        <main className="flex-1 p-6 min-w-0">

          {/* Result count + sort */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-semibold text-[#1a355d]">
                {filteredClinics.length}
              </span>{' '}
              clinics
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
                    <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredClinics.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#ebf8ff] flex items-center
                              justify-center mb-4">
                <svg className="w-6 h-6 stroke-[#3182ce] fill-none stroke-2"
                     viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <p className="font-semibold text-[#1a355d] mb-1">No clinics found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              <button
                onClick={resetFilters}
                className="mt-4 text-sm text-[#3182ce] font-medium hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}

          {/* Clinic grid — 3 cols → 2 cols → 1 col */}
          {!loading && filteredClinics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClinics.map(clinic => (
                <ClinicCard key={clinic.id} clinic={clinic} />
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}