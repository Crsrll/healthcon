"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([
    { id: '1', name: 'Dr. Ben Villanueva', spec: 'Internal Medicine', schedule: 'Mon–Fri, 8AM–12PM', available: true },
    { id: '2', name: 'Dr. Claire Mendoza', spec: 'Ob-Gyne', schedule: 'Tue, Thu, 1PM–5PM', available: true },
    { id: '3', name: 'Dr. Paolo Gutierrez', spec: 'General Practice', schedule: 'Mon, Wed, Fri', available: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [editingId, setEditingId] = useState(null); 

  const [formData, setFormData] = useState({
    name: "",
    spec: "",
    schedule: "",
    available: "Available",
  });

  // --- LOGIC: Handle Add vs Edit ---
  const handleSaveDoctor = (e) => {
    e.preventDefault();

    if (editingId) {
      setDoctors(doctors.map(doc => 
        doc.id === editingId 
          ? { ...doc, ...formData, available: formData.available === "Available" } 
          : doc
      ));
    } else {
      const entry = {
        id: Date.now().toString(),
        ...formData,
        available: formData.available === "Available"
      };
      setDoctors([...doctors, entry]);
    }

    closeModal();
  };

  // --- LOGIC: Open Modal for Edit ---
  const startEdit = (doc) => {
    setEditingId(doc.id);
    setFormData({
      name: doc.name,
      spec: doc.spec,
      schedule: doc.schedule,
      available: doc.available ? "Available" : doc.busy ? "Busy" : "On Leave",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", spec: "", schedule: "", available: "Available" });
  };

  const removeDoctor = (id) => {
    setDoctors(doctors.filter(doc => doc.id !== id));
  };

  const toggleAvailability = (id) => {
    setDoctors(doctors.map(doc => 
      doc.id === id ? { ...doc, available: !doc.available } : doc
    ));
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.spec.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Manage Doctors</h2>
          <p className="text-xs text-slate-400 mt-0.5">Add, edit, or toggle doctor availability</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          Add Doctor
        </button>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
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
              <option value="On Leave">Busy</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-2xl font-bold text-sm mt-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
            {editingId ? "Update Doctor Information" : "Save New Doctor"}
          </button>
        </form>
      </Modal>

      {/* --- DOCTORS TABLE --- */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors..." 
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-teal-400 transition-colors" 
            />
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Doctor', 'Specialization', 'Schedule', 'Availability', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredDoctors.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
                      {doc.name.split(' ').filter(n => !n.includes('.')).join(' ')[0] || 'D'}
                    </div>
                    <span className="font-semibold text-sm text-slate-800">{doc.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="text-xs font-semibold bg-teal-50 text-teal-700 rounded-full px-2.5 py-1">{doc.spec}</span></td>
                <td className="px-6 py-4 text-sm text-slate-500">{doc.schedule}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleAvailability(doc.id)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${doc.available ? 'bg-teal-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${doc.available ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => startEdit(doc)}
                      className="text-xs font-semibold text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => removeDoctor(doc.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}