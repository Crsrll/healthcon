"use client";
import { useState, useEffect } from "react";
import { Search, Loader2, CalendarDays, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function DailySchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Get Today's Date formatted exactly like your database (YYYY-MM-DD)
  const today = new Date().toLocaleDateString('en-CA'); // Outputs "YYYY-MM-DD"

  const fetchDailySchedule = async () => {
    if (!user?.uid) return;
    try {
      const res = await fetch(`/api/bookings/daily?clinicID=${user.uid}&date=${today}`);
      const json = await res.json();
      if (json.success) setSchedule(json.data);
    } catch (err) {
      console.error("Fetch error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchDailySchedule();
  }, [user, authLoading]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/bookings/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id, status: newStatus })
      });
      if (res.ok) {
        // Update local state so it changes instantly on screen
        setSchedule(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  const filtered = schedule.filter(s => 
    s.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    s.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
    s.service?.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-teal-500" /></div>;

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Daily Schedule</h2>
          <p className="text-sm text-teal-600 font-bold flex items-center gap-2">
            <CalendarDays size={14} /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search today's patients..." 
            className="w-full border rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-teal-400" 
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-slate-500">
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Doctor</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Status Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length > 0 ? filtered.map((slot) => (
              <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 text-sm font-bold text-slate-700">{slot.time}</td>
                <td className="px-6 py-5 font-bold text-slate-800">{slot.patientName}</td>
                <td className="px-6 py-5 font-bold text-slate-800">{slot.doctorName}</td>
                <td className="px-6 py-5">
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-3 py-1 rounded-lg uppercase">{slot.service}</span>
                </td>
                <td className="px-6 py-5">
                  <select 
                    value={slot.status}
                    onChange={(e) => handleUpdateStatus(slot.id, e.target.value)}
                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-all
                      ${slot.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-200' : 
                        slot.status === 'In Session' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                        slot.status === 'Waiting' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-500'}`}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="Waiting">Waiting</option>
                    <option value="In Session">In Session</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="py-20 text-center text-slate-400 italic">No appointments for today.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}