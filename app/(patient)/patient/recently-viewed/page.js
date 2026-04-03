"use client";
import Link from "next/link";
import { ChevronRight, MapPin, Clock } from "lucide-react";

export default function RecentlyViewed() {
  const recentviews = [
    { id: "1", name: "CDO General Outpatient", city: "Cagayan de Oro", time: "2 days ago", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400" },
    { id: "2", name: "Iligan Medical Center", city: "Iligan City", time: "2 days ago", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400" },
    { id: "3", name: "Bukidnon Community Center", city: "Malaybalay", time: "2 days ago",image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400" },
    { id: "4", name: "Melissa General Outpatient", city: "Dapitan", time: "3 days ago", image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400" },
    { id: "5", name: "Joseph Community Health", city: "Dapitan", time: "5 days ago", image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400" },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      {/* ── HEADER ── */}
      <div className="bg-[#1a365d] text-white pt-10 pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <Link href="/patient/dashboard" className="hover:text-white transition-colors">
              <span>Patient</span>
            </Link>
            <ChevronRight size={10} />
            <span className="text-white/60">Recently Viewed</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Recently Viewed</h1>
              <p className="text-teal-300 text-sm mt-1">Review clinics you recently visited or viewed.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── LIST SECTION ── */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-50">
            {recentviews.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between p-5 hover:bg-slate-50/50 transition-all group"
              >
                {/* Left: Clinic Info */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img
                    src={item.image}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm"
                    alt={item.name}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                        <MapPin size={10} className="text-teal-500" /> {item.city}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                        <Clock size={10} /> {item.time}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 mt-4 md:mt-0 ml-auto md:ml-0">
                  <Link href={`/clinics/${item.id}`}>
                    <button className="px-5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-[#1a365d] hover:text-white transition-all flex items-center gap-2">
                      See More <ChevronRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Showing your last {recentviews.length} viewed clinics
          </p>
        </div>
      </div>
    </main>
  );
}