"use client"
import { Suspense } from "react";
import FilterSidebar from "@/components/layout/FilterSidebar";
import { ClinicCard } from "@/components/ui/ClinicCard";
import { DoctorCard } from "@/components/clinic/DoctorCard1";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useClinics } from "@/hooks/useClinics";
import { useDoctors } from "@/hooks/useDoctors";
import { SlidersHorizontal, X } from "lucide-react";

const SPECIALTIES = ["All","General Practice","Pediatrics","Internal Medicine","Ob-Gyne","Cardiology"];
const CITIES      = ["All cities","Cagayan de Oro","Iligan City","Dapitan","Malaybalay"];

function ClinicDirectoryInner() {
  const { clinics, loading: clinicLoading } = useClinics("approved");
  const { doctors, loading: doctorLoading } = useDoctors();
  const isLoading = clinicLoading || doctorLoading;

  const clinicMap = useMemo(() => Object.fromEntries(clinics.map(c => [c.id, c])), [clinics]);

  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get("q") || "";

  const [mode,      setMode]      = useState("clinics");
  const [search,    setSearch]    = useState(qFromUrl);
  const [specialty, setSpecialty] = useState("All");
  const [city,      setCity]      = useState("All cities");
  const [results,   setResults]   = useState([]);
  const [filterOpen, setFilterOpen] = useState(false); // mobile filter drawer

  const activeFilterCount = (specialty !== "All" ? 1 : 0) + (city !== "All cities" ? 1 : 0);

  useEffect(() => {
    if (qFromUrl) {
      setSearch(qFromUrl);
      if (qFromUrl.toLowerCase().includes("dr")) setMode("doctors");
    }
  }, [qFromUrl]);

  useEffect(() => {
    if (isLoading) return;
    const q = search.toLowerCase();
    if (mode === "clinics") {
      setResults(clinics.filter(c => {
        const specs = Array.isArray(c.specialty) ? c.specialty : [c.specialty].filter(Boolean);
        return (c.clinicName?.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q)) &&
               (specialty === "All" || specs.includes(specialty)) &&
               (city === "All cities" || c.city === city);
      }));
    } else {
      setResults(doctors.filter(d => {
        const dc = clinicMap[d.clinicID];
        return (d.name?.toLowerCase().includes(q) || d.specialty?.toLowerCase().includes(q) || dc?.city?.toLowerCase().includes(q)) &&
               (specialty === "All" || d.specialty === specialty) &&
               (city === "All cities" || dc?.city === city);
      }));
    }
  }, [mode, search, specialty, city, clinics, doctors, isLoading, clinicMap]);

  function resetFilters() { setSearch(""); setSpecialty("All"); setCity("All cities"); }
  function handleModeChange(m) { setMode(m); setSearch(""); setSpecialty("All"); setCity("All cities"); }

  const label = mode === "clinics"
    ? `${results.length} clinic${results.length !== 1 ? "s" : ""}`
    : `${results.length} doctor${results.length !== 1 ? "s" : ""}`;

  return (
    <div className="min-h-screen bg-[#f7fafc]">
      {/* Hero */}
      <div className="bg-[#1a355d] px-4 sm:px-8 py-8">
        <p className="text-teal-400 font-semibold uppercase text-xs tracking-widest mb-2">
          Mindanao · Verified Clinics
        </p>
        <h1 className="text-2xl sm:text-3xl text-[#f7fafc] font-bold mb-2">
          {mode === "clinics" ? "Find a Clinic Near You" : "Find a Doctor"}
        </h1>
        <p className="text-[#f7fafc]/60 mb-5 max-w-md text-sm">
          {mode === "clinics" ? "Browse verified clinics across Mindanao." : "Search doctors by name or specialty."}
        </p>
        <div className="flex gap-2 max-w-lg">
          <input
            type="text"
            placeholder={mode === "clinics" ? "Search by clinic name or city..." : "Search by doctor name..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm outline-none focus:border-teal-400/50 focus:bg-white/15 transition-all"
          />
          <button className="bg-[#3182ce] hover:bg-[#2b6cb0] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Mobile filter bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="flex bg-slate-100 rounded-xl p-0.5 gap-0.5">
          {["clinics","doctors"].map(m => (
            <button key={m} onClick={() => handleModeChange(m)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition-all
                ${mode === m ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}>
              {m}
            </button>
          ))}
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
        >
          <SlidersHorizontal size={13} />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-[#1a355d] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <p className="font-bold text-slate-800">Filters</p>
              <button onClick={() => setFilterOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                mode={mode} onModeChange={m => { handleModeChange(m); }}
                specialty={specialty} onSpecialtyChange={setSpecialty}
                city={city} onCityChange={setCity}
                onReset={() => { resetFilters(); setFilterOpen(false); }}
                SPECIALTIES={SPECIALTIES} CITIES={CITIES}
                compact
              />
            </div>
            <div className="p-4 border-t border-slate-100">
              <button onClick={() => setFilterOpen(false)}
                className="w-full bg-[#1a355d] text-white font-bold py-3 rounded-xl text-sm">
                Show {results.length} {mode}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex items-start">
        {/* Desktop sidebar — hidden on mobile */}
        <div className="hidden md:block">
          <FilterSidebar
            mode={mode} onModeChange={handleModeChange}
            specialty={specialty} onSpecialtyChange={setSpecialty}
            city={city} onCityChange={setCity}
            onReset={resetFilters}
            SPECIALTIES={SPECIALTIES} CITIES={CITIES}
          />
        </div>

        <main className="flex-1 p-4 sm:p-6 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-[#1a355d]">{label}</span>
            </p>
            {search && (
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium truncate max-w-[140px]">
                "{search}"
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white h-64 rounded-2xl border border-gray-100 animate-pulse" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-semibold text-[#1a355d] mb-1">No {mode} found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              <button onClick={resetFilters} className="mt-4 text-sm text-[#3182ce] font-medium hover:underline">
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mode === "clinics"
                ? results.map(clinic => <ClinicCard key={clinic.id} clinic={clinic} />)
                : results.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} clinic={clinicMap[doctor.clinicID]} />)
              }
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ClinicDirectory() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClinicDirectoryInner />
    </Suspense>
  );
}
