"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Search, MoreHorizontal, Pill, FileUp, User, Send, Upload, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Link from "next/link";

export default function BookingHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  
  // Extract initial values from URL
  const urlQuery = searchParams.get("q") || "";
  const urlStatus = searchParams.get("status") || "All";

  // --- STATES ---
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlQuery);
  const [filter, setFilter] = useState(urlStatus);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [selectedBooking, setSelectedBooking] = useState(null);

  const dropdownRef = useRef(null);

  // --- DATA FETCHING ---
  const fetchHistory = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/history?clinicID=${user.uid}`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
      }
    } catch (err) {
      console.error("Fetch history failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    if (!authLoading && user) {
      fetchHistory();
    }
  }, [user, authLoading]);

  // Sync state with URL changes
  useEffect(() => {
    setSearch(urlQuery);
    setFilter(urlStatus);
  }, [urlQuery, urlStatus]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC ---
  const updateBookingStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/bookings/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id, status: newStatus })
      });

      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const openActionModal = (type, booking) => {
    setModalType(type);
    setSelectedBooking(booking);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  // --- FILTERED DATA ---
  const filteredBookings = bookings.filter(b => {
    // Case-insensitive status match
    const matchesStatus = filter === "All" || 
      b.status?.toLowerCase() === filter.toLowerCase();
    
    // Case-insensitive search match
    const searchTerm = search.toLowerCase();
    const matchesSearch = 
      (b.patientName?.toLowerCase() || "").includes(searchTerm) || 
      (b.doctorName?.toLowerCase() || "").includes(searchTerm) ||
      (b.service?.toLowerCase() || "").includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  const statusStyle = {
    Completed: "bg-green-100 text-green-700 border-green-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    rejected: "bg-red-100 text-red-600 border-red-200",
    Cancelled: "bg-red-100 text-red-600 border-red-200",
  };

  if (authLoading || loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-xs font-bold uppercase tracking-widest">Loading History...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Booking History</h2>
          <p className="text-sm text-slate-400 font-medium italic">Manage patient flow and post-visit documentation</p>
        </div>
      </div>

      {/* TABLE SECTION */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient or doctor..." 
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-teal-400 transition-all bg-white" 
            />
          </div>

          <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit border border-slate-200">
            {["All", "Confirmed", "Completed", "Cancelled"].map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                  filter.toLowerCase() === opt.toLowerCase() ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {['Patient', 'Doctor', 'Service', 'Schedule', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.length > 0 ? filteredBookings.map(booking => (
                <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100">
                        {/* If you don't have patientName saved in booking, you can show ID or placeholder */}
                        {booking.patientName ? booking.patientName.substring(0, 2).toUpperCase() : "PT"}
                      </div>
                      <span className="font-bold text-sm text-slate-800">{booking.patientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {booking.doctorName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {booking.service}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-700">{booking.date}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{booking.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyle[booking.status] || "bg-slate-100 text-slate-400"}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 relative">
                    {booking.status?.toLowerCase() === 'confirmed' && (
                      <button 
                        onClick={() => updateBookingStatus(booking.id, 'Completed')}
                        className="bg-[#00c9a7] text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-[#00b092] transition-all"
                      >
                        Mark Done
                      </button>
                    )}

                    {booking.status?.toLowerCase() === 'completed' && (
                      <div className="relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === booking.id ? null : booking.id)}
                          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        {/* DROPDOWN MENU */}
                        {activeDropdown === booking.id && (
                          <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-100">
                            <button 
                              onClick={() => openActionModal("prescribe", booking)}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-600 flex items-center gap-2"
                            >
                              <Pill size={14} /> Prescribe Meds
                            </button>
                            <button 
                              onClick={() => openActionModal("upload", booking)}
                              className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-600 flex items-center gap-2"
                            >
                              <FileUp size={14} /> Upload Lab Result
                            </button>
                            <hr className="my-1 border-slate-100" />
                            <Link href={`/clinic/patients/${booking.patientID}`} className="block px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2">
                              <User size={14} /> View Profile
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    {(booking.status?.toLowerCase() === 'cancelled' || booking.status?.toLowerCase() === 'rejected') && 
                        <span className="text-slate-300 ml-4 text-xs italic">No actions</span>
                    }
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="5" className="py-20 text-center text-slate-300 italic text-sm">No historical records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL FOR ACTIONS */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalType === "prescribe" ? "New Prescription" : "Upload Laboratory Result"}
      >
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
            <h4 className="text-base font-black text-slate-800 uppercase">{selectedBooking?.patientName}</h4>
          </div>

          {modalType === "prescribe" ? (
            <div className="space-y-4">
              <input placeholder="Medication Name (e.g. Amoxicillin)" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
              <textarea placeholder="Dosage Instructions..." className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 h-24 resize-none" />
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-teal-600 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                <Send size={14} /> Issue Prescription
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                <Upload className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-xs font-bold text-slate-500 uppercase">Click to upload PDF or Image</p>
              </div>
              <input placeholder="Test Name (e.g. Blood Test)" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" />
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-[#1a365d] text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest">
                Upload & Notify Patient
              </button>
            </div>
          )}
        </div>
      </Modal>
    </main>
  );
}