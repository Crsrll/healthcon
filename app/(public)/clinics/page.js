"use client";
import FilterSidebar from "@/components/layout/FilterSidebar";
import { ClinicCard } from "@/components/ui/ClinicCard";
import { DoctorCard } from "@/components/clinic/DoctorCard1";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useClinics } from "@/hooks/useClinics";
import { useDoctors } from "@/hooks/useDoctors";

const DUMMY_DOCTORS = [
  {
    id: "1",
    name: "Dr. Rosa Macaraeg",
    specialty: "General Practice",
    clinicID: "1",
    clinicName: "CDO General Outpatient Clinic",
  },
  {
    id: "2",
    name: "Dr. Jun Dela Cruz",
    specialty: "Pediatrics",
    clinicID: "1",
    clinicName: "CDO General Outpatient Clinic",
  },
  {
    id: "3",
    name: "Dr. Sofia Castillo",
    specialty: "Internal Medicine",
    clinicID: "2",
    clinicName: "Iligan City Medical Center",
  },
  {
    id: "4",
    name: "Dr. Marco Reyes",
    specialty: "Cardiology",
    clinicID: "2",
    clinicName: "Iligan City Medical Center",
  },
  {
    id: "5",
    name: "Dr. Ana Santos",
    specialty: "General Practice",
    clinicID: "3",
    clinicName: "Bukidnon Community Health",
  },
  {
    id: "6",
    name: "Dr. Lena Cruz",
    specialty: "Pediatrics",
    clinicID: "4",
    clinicName: "Nova Community Health",
  },
  {
    id: "7",
    name: "Dr. Ben Villanueva",
    specialty: "Internal Medicine",
    clinicID: "5",
    clinicName: "Joseph Community Health",
  },
  {
    id: "8",
    name: "Dr. Claire Mendoza",
    specialty: "Ob-Gyne",
    clinicID: "6",
    clinicName: "Che Ann Community Health",
  },
  {
    id: "9",
    name: "Dr. Paolo Gutierrez",
    specialty: "General Practice",
    clinicID: "7",
    clinicName: "Sheila Community Health",
  },
  {
    id: "10",
    name: "Dr. Mia Fernandez",
    specialty: "Internal Medicine",
    clinicID: "8",
    clinicName: "Xhyndy Community Health",
  },
  {
    id: "11",
    name: "Dr. James Ramos",
    specialty: "Pediatrics",
    clinicID: "8",
    clinicName: "Xhyndy Community Health",
  },
  {
    id: "12",
    name: "Dr. Tina Navarro",
    specialty: "Ob-Gyne",
    clinicID: "9",
    clinicName: "Jashtenne Community Health",
  },
];

const SPECIALTIES = [
  "All",
  "General Practice",
  "Pediatrics",
  "Internal Medicine",
  "Ob-Gyne",
  "Cardiology",
];
const CITIES = [
  "All cities",
  "Cagayan de Oro",
  "Iligan City",
  "Dapitan",
  "Malaybalay",
];

export default function ClinicDirectory() {
  const { clinics, loading: clinicLoading } = useClinics("approved");
  const { doctors, loading: doctorLoading } = useDoctors();

  const isLoading = clinicLoading || doctorLoading;

  const clinicMap = useMemo(
    () => Object.fromEntries(clinics.map((c) => [c.id, c])),
    [clinics],
  );

  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get("q") || "";

  const [mode, setMode] = useState("clinics");
  const [search, setSearch] = useState(qFromUrl); // Initialize with URL param
  const [specialty, setSpecialty] = useState("All");
  const [city, setCity] = useState("All cities");
  const [results, setResults] = useState([]);
  // const [loading, setLoading] = useState(true);

  // 1. Sync local search state if the URL changes (Global Search Bar)
  useEffect(() => {
    if (qFromUrl) {
      setSearch(qFromUrl);
      // Optional: Auto-switch to doctors mode if searching for "Dr."
      if (qFromUrl.toLowerCase().includes("dr")) {
        setMode("doctors");
      }
    }
  }, [qFromUrl]);

  // 2. Main Filtering Logic
  useEffect(() => {
    if (isLoading) return; // wait for clinics to load first

    const q = search.toLowerCase();

    if (mode === "clinics") {
      const filtered = clinics.filter((c) => {
        const specs = Array.isArray(c.specialty)
          ? c.specialty
          : [c.specialty].filter(Boolean);

        const matchSearch =
          c.clinicName?.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q);
        const matchSpecialty = specialty === "All" || specs.includes(specialty);
        const matchCity = city === "All cities" || c.city === city;
        return matchSearch && matchSpecialty && matchCity;
      });
      setResults(filtered);
    } else {
      const filtered = doctors.filter((d) => {
        const doctorClinic = clinicMap[d.clinicID]; // get clinic from map

        const matchSearch =
          d.name?.toLowerCase().includes(q) ||
          d.specialty?.toLowerCase().includes(q) ||
          doctorClinic?.city?.toLowerCase().includes(q);
        const matchSpecialty = specialty === "All" || d.specialty === specialty;
        const matchCity = city === "All cities" || doctorClinic?.city === city; // ← lookup city from clinic

        return matchSearch && matchSpecialty && matchCity;
      });
      setResults(filtered);
    }
  }, [mode, search, specialty, city, clinics, doctors, isLoading]); // ← add clinics + loading here

  function resetFilters() {
    setSearch("");
    setSpecialty("All");
    setCity("All cities");
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setSearch("");
    setSpecialty("All");
    setCity("All cities");
  }

  const label =
    mode === "clinics"
      ? `${results.length} clinic${results.length !== 1 ? "s" : ""}`
      : `${results.length} doctor${results.length !== 1 ? "s" : ""}`;

  return (
    <div className="min-h-screen bg-[#f7fafc]">
      {/* ── Hero ── */}
      <div className="bg-[#1a355d] px-8 py-8">
        <p className="text-teal-400 font-semibold uppercase text-xs tracking-widest mb-2">
          Mindanao · Verified Clinics
        </p>
        <h1 className="text-3xl text-[#f7fafc] font-bold mb-2">
          {mode === "clinics" ? "Find a Clinic Near You" : "Find a Doctor"}
        </h1>
        <p className="text-[#f7fafc]/60 mb-6 max-w-md text-sm">
          {mode === "clinics"
            ? "Browse verified clinics across Mindanao."
            : "Search doctors by name or specialty."}
        </p>

        <div className="flex gap-2 max-w-lg">
          <input
            type="text"
            placeholder={
              mode === "clinics"
                ? "Search by clinic name or city..."
                : "Search by doctor name..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm outline-none focus:border-teal-400/50 focus:bg-white/15 transition-all"
          />
          <button className="bg-[#3182ce] hover:bg-[#2b6cb0] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex items-start">
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

        <main className="flex-1 p-6 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-[#1a355d]">{label}</span>
            </p>
            {search && (
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                Filtered by: "{search}"
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white h-64 rounded-2xl border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-semibold text-[#1a355d] mb-1">
                No {mode} found
              </p>
              <p className="text-sm text-gray-400">
                Try adjusting your search or filters
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 text-sm text-[#3182ce] font-medium hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mode === "clinics"
                ? results.map((clinic) => (
                    <ClinicCard key={clinic.id} clinic={clinic} />
                  ))
                : results.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      clinic={clinicMap[doctor.clinicID]}
                    />
                  ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
