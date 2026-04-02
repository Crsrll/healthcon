"use client";
import { useState } from "react";
import Link from "next/link";
import { Star, MapPin, Clock, ChevronRight, Heart, Trash2 } from "lucide-react";

export default function FavoriteClinics() {
  const [favorites, setFavorites] = useState([
    { 
      id: "1", 
      name: "CDO General Outpatient", 
      city: "Cagayan de Oro", 
      specialty: "Ob-Gyne", 
      rating: 4.8, 
      reviews: 124,
      status: "Open",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600" 
    },
    { 
      id: "2", 
      name: "Iligan Medical Center", 
      city: "Iligan City", 
      specialty: "Cardiology", 
      rating: 4.9, 
      reviews: 89,
      status: "Open",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600" 
    },
    { 
      id: "3", 
      name: "Joseph Community Health", 
      city: "Dapitan City", 
      specialty: "General Practice", 
      rating: 4.7, 
      reviews: 210,
      status: "Closed",
      image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600" 
    }
  ]);

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(c => c.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      
      {/* ── HEADER ── */}
      <div className="bg-[#1a365d] text-white pt-12 pb-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <span>Patient</span>
              <ChevronRight size={10} />
              <span className="text-white/60">Favorites</span>
            </nav>
            <h1 className="text-3xl font-bold">Favorite Clinics</h1>
            <p className="text-blue-200/70 text-sm mt-2 font-medium">Quick access to your trusted healthcare providers.</p>
          </div>
          <Link href="/clinics" className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-xl shadow-teal-900/40 active:scale-95">
            Explore More Clinics
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12 space-y-8">
        
        {/* ── CLINIC GRID ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.length > 0 ? (
            favorites.map((clinic) => (
              <div key={clinic.id} className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden flex flex-col">
                
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img src={clinic.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={clinic.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${clinic.status === 'Open' ? 'bg-teal-500 text-white' : 'bg-red-500 text-white'}`}>
                      {clinic.status}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFavorite(clinic.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-2xl flex items-center justify-center hover:bg-red-500 transition-all duration-300"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                    <div>
                      <p className="text-teal-400 text-[10px] font-black uppercase tracking-widest mb-1">{clinic.specialty}</p>
                      <h3 className="text-white font-bold text-lg leading-tight">{clinic.name}</h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-white text-xs font-black">{clinic.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={14} className="text-teal-500" />
                    <span className="text-xs font-bold uppercase tracking-tight">{clinic.city}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium">
                    <Clock size={14} />
                    <span>Last visited: 2 months ago</span>
                  </div>

                  <div className="pt-4 mt-auto flex gap-2">
                    <Link href={`/clinics/${clinic.id}`} className="flex-1 bg-[#1a365d] hover:bg-blue-800 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center transition-all shadow-lg shadow-blue-900/10 active:scale-95">
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="col-span-full bg-white py-24 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
              <Heart className="text-slate-200 mx-auto mb-4" size={48} />
              <p className="text-slate-900 font-black uppercase tracking-widest text-sm">No favorites found</p>
              <p className="text-slate-400 text-xs mt-1">You haven't saved any clinics to your favorites yet.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}