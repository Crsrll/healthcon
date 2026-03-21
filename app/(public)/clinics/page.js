'use client';

import { ClinicCard } from '@/components/ui/ClinicCard';
import { useState, useEffect } from 'react';

export default function ClinicDirectory() {
  const [clinics,         setClinics]         = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [search,          setSearch]          = useState('');
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    const dummy = [
      { id: '1', name: 'CDO General Outpatient Clinic', city: 'Cagayan de Oro', doctors: 3 },
      { id: '2', name: 'Iligan City Medical Center',    city: 'Iligan City',    doctors: 5 },
      { id: '3', name: 'Bukidnon Community Health',     city: 'Malaybalay',     doctors: 1 },
      { id: '4', name: 'Nova Community Health',     city: 'Dapitan',     doctors: 4 },
      { id: '5', name: 'Joseph Community Health',     city: 'Dapitan',     doctors: 6 },
      { id: '6', name: 'Che Ann Community Health',     city: 'Dapitan',     doctors: 7 },
      { id: '7', name: 'Sheila Community Health',     city: 'Dapitan',     doctors: 6 },
      { id: '8', name: 'Xhyndy Community Health',     city: 'Dapitan',     doctors: 9 },
      { id: '9', name: 'Jashtenne Community Health',     city: 'Dapitan',     doctors: 11 },
      { id: '10', name: 'Judel Community Health',     city: 'Dapitan',     doctors: 9 },
      { id: '11', name: 'Leo Community Health',     city: 'Dapitan',     doctors: 6 },
      { id: '12', name: 'Jade Community Health',     city: 'Dapitan',     doctors: 6 },
      { id: '13', name: 'Angel Community Health',     city: 'Dapitan',     doctors: 8 },
      { id: '14', name: 'Ayono Community Health',     city: 'Dapitan',     doctors: 6 },
      { id: '15', name: 'Vinculado Community Health',     city: 'Dapitan',     doctors: 6 },
      { id: '16', name: 'Jacalan Community Health',     city: 'Dapitan',     doctors: 8 },
    ];
    setClinics(dummy);
    setFilteredClinics(dummy);
    setLoading(false);
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredClinics(
      clinics.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      )
    );
  }, [search, clinics]);

    return(
        <>
            <div className="min-h-screen bg-[#f7fafc]">
                <div>
                <div className="bg-[#19365d] p-6">
                    <h1 className="text-3xl text-[#f7fafc] font-bold">Clinic Directory</h1>
                    <p className="text-[#f7fafc] mt-2">Browse all verified clinic across Mindanao</p>
                </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-[1fr_4fr] gap-6 min-h-screen p-6">
                <div className="relative top-0 left-0">
                    <h2 className="text-2xl font-semibold mb-4">Search Clinics</h2>
                    <input
                        type="text"
                        placeholder="Search by name or city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>
                <div className="">
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto min-h-screen no-scrollbar">
                        {filteredClinics.map(clinic => (
                            <ClinicCard key={clinic.id} clinic={clinic} />
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}
