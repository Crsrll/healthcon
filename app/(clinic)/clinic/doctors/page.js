"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Search, UserPlus, Edit, Trash2, Loader2, Clock, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; 

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorsPage() {
  // 1. Destructure BOTH user and loading from the hook
  const { user, loading: authLoading } = useAuth(); 
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true); // This is for the data fetch
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    available: true,
    availability: {
      days: [],
      startTime: "08:00",
      endTime: "17:00"
    }
  });

  // 2. Wrap fetch in a function
  const fetchDoctors = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      // Use the dynamic ID from the logged-in user
      const res = await fetch(`/api/doctors?clinicID=${user.uid}`); 
      const json = await res.json();
      if (json.success) {
        setDoctors(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Effect triggered when auth finishes loading
  useEffect(() => {
    if (!authLoading && user) {
      fetchDoctors();
    }
  }, [user, authLoading]);

  const handleToggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter(d => d !== day)
          : [...prev.availability.days, day]
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      ...formData,
      id: editingId,
      clinicID: user.uid // Automatically tag with the logged-in clinic ID
    };

    const res = await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      fetchDoctors();
      closeModal();
    }
  };

  const startEdit = (doc) => {
    setEditingId(doc.id);
    setFormData({
      name: doc.name,
      specialty: doc.specialty,
      available: doc.available,
      availability: doc.availability || { days: [], startTime: "08:00", endTime: "17:00" }
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", specialty: "", available: true, availability: { days: [], startTime: "08:00", endTime: "17:00" } });
  };

  // 4. Handle early returns for Auth
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-500" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
        <p className="text-slate-500">Please log in to your clinic account to view the registry.</p>
      </div>
    );
  }

  const filteredDoctors = doctors.filter(doc => {
    const matchSearch = doc.name?.toLowerCase().includes(search.toLowerCase()) || doc.specialty?.toLowerCase().includes(search.toLowerCase());
    const matchTab = filter === "All" || (filter === "Active" ? doc.available : !doc.available);
    return matchSearch && matchTab;
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Doctor Registry</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
             {doctors.length} Registered Doctors
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20">
          <UserPlus size={18} /> Add Doctor
        </button>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter list..." 
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-teal-400 transition-all bg-white" 
            />
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {["All","Active","Inactive"].map(tab => (
              <button key={tab} onClick={() => setFilter(tab)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all uppercase ${filter === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-slate-300" /></div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specialization</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schedule</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDoctors.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-sm text-slate-800">Dr. {doc.name}</td>
                  <td className="px-6 py-4"><span className="text-[10px] font-bold bg-teal-50 text-teal-700 rounded-full px-2.5 py-1 uppercase">{doc.specialty}</span></td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1"><Calendar size={12}/> {doc.availability?.days?.map(d => d.substring(0,3)).join(", ")}</div>
                    <div className="flex items-center gap-1 mt-0.5"><Clock size={12}/> {doc.availability?.startTime} - {doc.availability?.endTime}</div>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <button onClick={() => startEdit(doc)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Edit size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? "Edit Doctor" : "Register Doctor"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
            <input required className="w-full border rounded-xl px-4 py-2.5 text-sm" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Specialty</label>
            <input required className="w-full border rounded-xl px-4 py-2.5 text-sm" 
              value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Weekly Availability</p>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map(day => (
                <button type="button" key={day} onClick={() => handleToggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${formData.availability.days.includes(day) ? 'bg-teal-500 text-white' : 'bg-white border text-slate-400'}`}>
                  {day.substring(0,3)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="time" className="w-full border p-2 rounded-lg text-xs" value={formData.availability.startTime} onChange={e => setFormData({...formData, availability: {...formData.availability, startTime: e.target.value}})} />
              <input type="time" className="w-full border p-2 rounded-lg text-xs" value={formData.availability.endTime} onChange={e => setFormData({...formData, availability: {...formData.availability, endTime: e.target.value}})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-teal-600/20">
            {editingId ? "Update Doctor" : "Save New Doctor"}
          </button>
        </form>
      </Modal>
    </main>
  );
}