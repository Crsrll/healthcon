"use client";
import { useState } from "react";

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState("All");

  const statusStyle = {
    Completed:  "bg-green-100 text-green-700",
    Confirmed:  "bg-blue-100 text-blue-700",
    Pending:    "bg-amber-100 text-amber-700",
    Cancelled:  "bg-red-100 text-red-600",
  };

  const bookings = [
    { id: 1, patient: 'John Wick',    doctor: 'Dr. Ben Villanueva',  service: 'Consultation', date: 'Mar 24, 9:00 AM',  status: 'Pending'   },
    { id: 2, patient: 'Sarah Connor', doctor: 'Dr. Claire Mendoza',  service: 'Check-up',     date: 'Mar 24, 10:30 AM', status: 'Confirmed' },
    { id: 3, patient: 'Bruce Wayne',  doctor: 'Dr. Ben Villanueva',  service: 'Follow-up',    date: 'Mar 24, 1:00 PM',  status: 'Completed' },
    { id: 4, patient: 'Diana Prince', doctor: 'Dr. Paolo Gutierrez', service: 'Consultation', date: 'Mar 25, 8:00 AM',  status: 'Pending'   },
    { id: 5, patient: 'Peter Parker', doctor: 'Dr. Claire Mendoza',  service: 'Prenatal',     date: 'Mar 25, 2:00 PM',  status: 'Cancelled' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Bookings</h2>
          <p className="text-xs text-slate-400 mt-0.5">Review, accept, or decline booking requests</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Patient', 'Doctor', 'Service', 'Date & Time', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.filter(b => activeTab === 'All' || b.status === activeTab).map(booking => (
              <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0">
                      {booking.patient.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-semibold text-sm text-slate-800">{booking.patient}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{booking.doctor}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{booking.service}</td>
                <td className="px-6 py-4 font-semibold text-sm text-slate-700">{booking.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${statusStyle[booking.status] ?? 'bg-slate-100 text-slate-500'}`}>{booking.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {booking.status === 'Pending' && (<>
                      <button className="text-xs font-semibold text-white bg-teal-500 hover:bg-teal-400 px-3 py-1.5 rounded-lg transition-colors">Accept</button>
                      <button className="text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-lg transition-colors">Decline</button>
                    </>)}
                    {booking.status === 'Confirmed' && <button className="text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">Mark Done</button>}
                    {(booking.status === 'Completed' || booking.status === 'Cancelled') && <span className="text-xs text-slate-300">—</span>}
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