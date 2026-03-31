"use client";
import { useState, useEffect } from "react"; 
import { useSearchParams } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { Search, UserPlus, Edit, Trash2 } from "lucide-react";

export default function DoctorsPage() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [doctors, setDoctors] = useState([
    { id: '1', name: 'Dr. Ben Villanueva', spec: 'Internal Medicine', schedule: 'Mon–Fri, 8AM–12PM', available: true, status: 'active' },
    { id: '2', name: 'Dr. Claire Mendoza', spec: 'Ob-Gyne', schedule: 'Tue, Thu, 1PM–5PM', available: true, status: 'active' },
    { id: '3', name: 'Dr. Paolo Gutierrez', spec: 'General Practice', schedule: 'Mon, Wed, Fri', available: false, status: 'inactive' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState(urlQuery);
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({ name: "", spec: "", schedule: "", available: "Available" });

  // Sync local search state with URL query from Layout
  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  // --- CONSOLIDATED FILTER LOGIC ---
  const filteredDoctors = doctors.filter(doc => {
    const q = search.toLowerCase();
    const matchSearch = doc.name.toLowerCase().includes(q) || doc.spec.toLowerCase().includes(q);
    const matchTab = filter === "All" || doc.status === filter.toLowerCase();
    return matchSearch && matchTab;
  });

  // --- HANDLERS ---
  const handleSaveDoctor = (e) => {
    e.preventDefault();
    const isAvailable = formData.available === "Available";
    const currentStatus = isAvailable ? 'active' : 'inactive';

    if (editingId) {
      setDoctors(doctors.map(d => d.id === editingId 
        ? { ...d, ...formData, available: isAvailable, status: currentStatus } 
        : d
      ));
    } else {
      setDoctors([...doctors, { 
        id: Date.now().toString(), 
        ...formData, 
        available: isAvailable, 
        status: currentStatus 
      }]);
    }
    closeModal();
  };

  const startEdit = (doc) => {
    setEditingId(doc.id);
    setFormData({ 
      name: doc.name, 
      spec: doc.spec, 
      schedule: doc.schedule, 
      available: doc.available ? "Available" : "On Leave" 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", spec: "", schedule: "", available: "Available" });
  };

  const removeDoctor = (id) => {
    if(confirm("Are you sure you want to remove this doctor?")) {
        setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  const toggleAvailability = (id) => {
    setDoctors(doctors.map(doc => 
      doc.id === id ? { ...doc, available: !doc.available, status: !doc.available ? 'active' : 'inactive' } : doc
    ));
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Doctor Registry</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            {doctors.filter(d => d.status === 'active').length} Active · {doctors.length} Total
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20">
          <UserPlus size={18} /> Add Doctor
        </button>
      </div>

      {search && (
        <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl w-fit">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            Results for: <span className="text-slate-800">"{search}"</span>
          </p>
        </div>
      )}

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {['Doctor', 'Specialization', 'Schedule', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredDoctors.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-sm text-slate-800">{doc.name}</td>
                <td className="px-6 py-4"><span className="text-[10px] font-bold bg-teal-50 text-teal-700 rounded-full px-2.5 py-1 uppercase">{doc.spec}</span></td>
                <td className="px-6 py-4 text-xs text-slate-500">{doc.schedule}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleAvailability(doc.id)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${doc.available ? 'bg-teal-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${doc.available ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(doc)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Edit size={16}/></button>
                    <button onClick={() => removeDoctor(doc.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Doctor Details" : "Register New Doctor"}
      >
        <form onSubmit={handleSaveDoctor} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
            <input required placeholder="Dr. Name Surname" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Specialization</label>
            <input required placeholder="e.g. Pediatrics" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400" 
              value={formData.spec} onChange={e => setFormData({...formData, spec: e.target.value})} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Schedule</label>
            <input required placeholder="e.g. Mon-Fri, 8AM-12PM" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400" 
              value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
            <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-teal-400"
              value={formData.available} onChange={e => setFormData({...formData, available: e.target.value})}>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-2xl font-bold text-sm mt-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
            {editingId ? "Update Doctor Information" : "Save New Doctor"}
          </button>
        </form>
      </Modal>
    </main>
  );
}