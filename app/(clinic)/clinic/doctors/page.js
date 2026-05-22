"use client";
import { useState, useRef } from "react";
import { uploadImage } from "@/lib/uploadImage";
import Modal from "@/components/ui/Modal";
import { Search, UserPlus, Edit, Loader2, Clock, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useClinicDoctors } from "@/hooks/useClinicDoctors";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const EMPTY_FORM = {
  name: "",
  specialty: "",
  available: true,
  availability: { days: [], startTime: "08:00", endTime: "17:00" },
  image: "",
};

export default function DoctorsPage() {
  const { user, loading: authLoading } = useAuth();
  const { doctors, loading, saveDoctor } = useClinicDoctors(user?.uid);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef(null);

  const handleToggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter((d) => d !== day)
          : [...prev.availability.days, day],
      },
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    const result = await saveDoctor({ ...formData, id: editingId });
    if (result.success) closeModal();
    else alert("Failed to save doctor");
  };

  const startEdit = (doc) => {
    setEditingId(doc.id);
    setFormData({
      name: doc.name,
      specialty: doc.specialty,
      available: doc.available,
      availability: doc.availability || { days: [], startTime: "08:00", endTime: "17:00" },
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

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
        <p className="text-slate-500">Please log in to your clinic account.</p>
      </div>
    );
  }

  const filteredDoctors = doctors.filter((doc) => {
    const matchSearch =
      doc.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      filter === "All" || (filter === "Active" ? doc.available : !doc.available);
    return matchSearch && matchTab;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Doctor Registry</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            {doctors.length} Registered Doctors
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20"
        >
          <UserPlus size={18} /> Add Doctor
        </button>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/30">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter list..."
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-teal-400 transition-all bg-white"
            />
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
            {["All", "Active", "Inactive"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all uppercase ${
                  filter === tab ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="animate-spin text-slate-300" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[520px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-4 sm:px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specialization</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Schedule</th>
                  <th className="px-4 sm:px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 font-bold text-sm text-slate-800">Dr. {doc.name}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-[10px] font-bold bg-teal-50 text-teal-700 rounded-full px-2.5 py-1 uppercase">
                        {doc.specialty}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs text-slate-500 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {doc.availability?.days?.map((d) => d.substring(0, 3)).join(", ")}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        {doc.availability?.startTime} - {doc.availability?.endTime}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <button
                        onClick={() => startEdit(doc)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? "Edit Doctor" : "Register Doctor"}>
        <form onSubmit={handleSave} className="space-y-4">
          {/* Doctor Photo */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Photo (optional)</label>
            <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            <div className="flex items-center gap-3">
              <div
                onClick={() => imageInputRef.current.click()}
                className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer hover:border-teal-400 transition-colors flex items-center justify-center bg-slate-50 shrink-0"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                ) : formData.image ? (
                  <img src={formData.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-300 text-xs">📷</span>
                )}
              </div>
              <button type="button" onClick={() => imageInputRef.current.click()} disabled={uploading}
                className="text-xs font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                {uploading ? "Uploading..." : formData.image ? "Change" : "Upload"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
            <input
              required
              className="w-full border rounded-xl px-4 py-2.5 text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Specialty</label>
            <input
              required
              className="w-full border rounded-xl px-4 py-2.5 text-sm"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            />
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Weekly Availability</p>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleToggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    formData.availability.days.includes(day)
                      ? "bg-teal-500 text-white"
                      : "bg-white border text-slate-400"
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="time"
                className="w-full border p-2 rounded-lg text-xs"
                value={formData.availability.startTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability: { ...formData.availability, startTime: e.target.value },
                  })
                }
              />
              <input
                type="time"
                className="w-full border p-2 rounded-lg text-xs"
                value={formData.availability.endTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability: { ...formData.availability, endTime: e.target.value },
                  })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-teal-600/20"
          >
            {editingId ? "Update Doctor" : "Save New Doctor"}
          </button>
        </form>
      </Modal>
    </main>
  );
}
