"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MoreHorizontal, Pill, FileUp, User, Send,Upload } from "lucide-react";
import Modal from "@/components/ui/Modal";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const urlStatus = searchParams.get("status") || "All";

  // --- STATES ---
  const [search, setSearch] = useState(urlQuery);
  const [filter, setFilter] = useState(urlStatus);
  const [activeDropdown, setActiveDropdown] = useState(null); // Tracks which row's "..." is open
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "prescribe" or "upload"
  const [selectedBooking, setSelectedBooking] = useState(null);

  const dropdownRef = useRef(null);

  const [bookings, setBookings] = useState([
    { id: 1, patient: 'John Wick', doctor: 'Dr. Ben Villanueva', service: 'Consultation', date: 'Mar 24, 9:00 AM', status: 'Confirmed' },
    { id: 2, patient: 'Sarah Connor', doctor: 'Dr. Claire Mendoza', service: 'Check-up', date: 'Mar 24, 10:30 AM', status: 'Confirmed' },
    { id: 3, patient: 'Bruce Wayne', doctor: 'Dr. Ben Villanueva', service: 'Follow-up', date: 'Mar 24, 1:00 PM', status: 'Completed' },
    { id: 4, patient: 'Diana Prince', doctor: 'Dr. Paolo Gutierrez', service: 'Consultation', date: 'Mar 25, 8:00 AM', status: 'Cancelled' },
    { id: 5, patient: 'Peter Parker', doctor: 'Dr. Claire Mendoza', service: 'Prenatal', date: 'Mar 25, 2:00 PM', status: 'Cancelled' },
    { id: 6, patient: 'Tony Stark', doctor: 'Dr. Ben Villanueva', service: 'Consultation', date: 'Mar 25, 4:00 PM', status: 'Confirmed' },
  ]);

  // --- EFFECTS ---
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
  const updateBookingStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const openActionModal = (type, booking) => {
    setModalType(type);
    setSelectedBooking(booking);
    setIsModalOpen(true);
    setActiveDropdown(null); // Close dropdown when modal opens
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filter === "All" || b.status === filter;
    const matchesSearch = b.patient.toLowerCase().includes(search.toLowerCase()) ||
                          b.doctor.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusStyle = {
    Completed: "bg-green-100 text-green-700 border-green-200",
    Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Cancelled: "bg-red-100 text-red-600 border-red-200",
  };

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
              placeholder="Search patient..." 
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-teal-400 transition-all bg-white" 
            />
          </div>

          <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit border border-slate-200">
            {["All", "Confirmed", "Completed", "Cancelled"].map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                  filter === opt ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
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
                {['Patient', 'Doctor', 'Date & Time', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.map(booking => (
                <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1a365d] text-white font-black text-xs flex items-center justify-center shrink-0">
                        {booking.patient[0]}
                      </div>
                      <span className="font-bold text-sm text-slate-800">{booking.patient}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{booking.doctor}</td>
                  <td className="px-6 py-4 font-bold text-sm text-slate-700">{booking.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyle[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 relative">
                    {booking.status === 'Confirmed' && (
                      <button 
                        onClick={() => updateBookingStatus(booking.id, 'Completed')}
                        className="bg-[#00c9a7] text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-[#00b092] transition-all"
                      >
                        Mark Done
                      </button>
                    )}

                    {booking.status === 'Completed' && (
                      <div className="relative" ref={activeDropdown === booking.id ? dropdownRef : null}>
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === booking.id ? null : booking.id)}
                          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        {/* DROPDOWN MENU */}
                        {activeDropdown === booking.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-100">
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
                            <Link href={`/clinic/patients/${booking.id}`} className="block px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2">
                              <User size={14} /> View Profile
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    {booking.status === 'Cancelled' && <span className="text-slate-300 ml-4">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>


      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalType === "prescribe" ? "New Prescription" : "Upload Laboratory Result"}
      >
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
            <h4 className="text-base font-black text-slate-800 uppercase">{selectedBooking?.patient}</h4>
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