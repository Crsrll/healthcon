"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Check, X, CheckCircle2 } from "lucide-react";

export default function BookingPage() {
  const searchParams = useSearchParams();
  
  const urlQuery = searchParams.get("q") || "";
  const urlStatus = searchParams.get("status") || "All";

  const [search, setSearch] = useState(urlQuery);
  const [filter, setFilter] = useState(urlStatus);

  useEffect(() => {
    setSearch(urlQuery);
    setFilter(urlStatus);
  }, [urlQuery, urlStatus]);

  const statusStyle = {
    Completed:  "bg-green-100 text-green-700 border-green-200",
    Confirmed:  "bg-blue-100 text-blue-700 border-blue-200",
    Pending:    "bg-amber-100 text-amber-700 border-amber-200",
    Cancelled:  "bg-red-100 text-red-600 border-red-200",
  };

  const [bookings, setBookings] = useState([
    { id: 1, patient: 'John Wick',    doctor: 'Dr. Ben Villanueva',  service: 'Consultation', date: 'Mar 24, 9:00 AM',  status: 'Pending'   },
    { id: 2, patient: 'Sarah Connor', doctor: 'Dr. Claire Mendoza',  service: 'Check-up',     date: 'Mar 24, 10:30 AM', status: 'Confirmed' },
    { id: 3, patient: 'Bruce Wayne',  doctor: 'Dr. Ben Villanueva',  service: 'Follow-up',    date: 'Mar 24, 1:00 PM',  status: 'Completed' },
    { id: 4, patient: 'Diana Prince', doctor: 'Dr. Paolo Gutierrez', service: 'Consultation', date: 'Mar 25, 8:00 AM',  status: 'Pending'   },
    { id: 5, patient: 'Peter Parker', doctor: 'Dr. Claire Mendoza',  service: 'Prenatal',     date: 'Mar 25, 2:00 PM',  status: 'Cancelled' },
    { id: 6, patient: 'Tony Stark',   doctor: 'Dr. Ben Villanueva',  service: 'Consultation', date: 'Mar 25, 4:00 PM',  status: 'Confirmed' },
  ]);

  // --- NEW: STATUS UPDATE LOGIC ---
  const updateBookingStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filter === "All" || b.status === filter;
    const matchesSearch = b.patient.toLowerCase().includes(search.toLowerCase()) ||
                          b.doctor.toLowerCase().includes(search.toLowerCase()) ||
                          b.service.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filterOptions = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Bookings</h2>
          <p className="text-sm text-slate-400 font-medium">Review, accept, or decline booking requests</p>
        </div>

        {search && (
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl w-fit">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              Results for: <span className="text-slate-800">"{search}"</span>
            </p>
          </div>
        )}
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
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
            {filterOptions.map((opt) => (
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
                {['Patient', 'Doctor', 'Service', 'Date & Time', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.length > 0 ? (
                filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center shrink-0 border border-blue-100">
                          {booking.patient.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-bold text-sm text-slate-800">{booking.patient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{booking.doctor}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{booking.service}</td>
                    <td className="px-6 py-4 font-bold text-sm text-slate-700">{booking.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyle[booking.status] ?? 'bg-slate-100 text-slate-500'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {booking.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                              className="bg-[#00c9a7] text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-[#00b092] transition-all"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                              className="bg-white border border-slate-200 text-slate-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-red-50 hover:text-red-500 transition-all"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {booking.status === 'Confirmed' && (
                          <button 
                            onClick={() => updateBookingStatus(booking.id, 'Completed')}
                            className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-teal-50 hover:text-teal-600 transition-all"
                          >
                            Mark Done
                          </button>
                        )}
                        {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
                          <span className="text-xs text-slate-300 font-bold ml-4">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-slate-400 italic text-sm">
                    No bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}