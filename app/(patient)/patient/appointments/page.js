"use client"
import { Suspense } from "react";
import { useState, useMemo, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Calendar, Clock, ChevronRight, Search, Plus, Clipboard, Loader2 } from "lucide-react";

function MyAppointmentsPageInner() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const urlTimeframe = searchParams.get("timeframe") || "Upcoming";
  const [timeframe, setTimeframe] = useState(urlTimeframe);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const t = searchParams.get("timeframe");
    if (t) setTimeframe(t);
  }, [searchParams]);

  const [searchQuery, setSearchQuery]     = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedApt, setSelectedApt]     = useState(null);
  const [appointments, setAppointments]   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [cancelling, setCancelling]       = useState(null);

  // ── Fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.uid) return;
    const fetchAppointments = async () => {
      setLoading(true);
      setError("");
      try {
        // Fixed: singular "patient" to match your route file
        const res  = await fetch(`/api/patients/appointments?patientID=${user.uid}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Failed to load appointments");

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const normalized = json.data.map(b => {
          // Handle both "2025-06-15" strings and Firestore Timestamps
          const appointmentDate = b.date ? new Date(b.date) : null;
          return {
            ...b,
            status: capitalize(b.status),
            // isPast: true only if the appointment date is strictly before today
            isPast: appointmentDate ? appointmentDate < today : false,
            // Normalize doctor name — field may vary across booking docs
            doctorName: b.doctorName || b.doctor || b.doctorFullName || "Unknown Doctor",
            clinicName: b.clinicName || b.clinic || "Unknown Clinic",
          };
        });

        setAppointments(normalized);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user?.uid]);

  // ── Filter ───────────────────────────────────────────────────────
  const filteredAppointments = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return appointments.filter(apt => {
      // Upcoming = today or future; Past = before today
      const matchesTime   = timeframe === "Upcoming" ? !apt.isPast : apt.isPast;
      const matchesStatus = activeTab === "All" || apt.status === activeTab;
      // Search across clinic name, doctor name, and service
      const matchesSearch = !q
        || (apt.clinicName || "").toLowerCase().includes(q)
        || (apt.doctorName || "").toLowerCase().includes(q)
        || (apt.service    || "").toLowerCase().includes(q);
            return matchesTime && matchesStatus && matchesSearch;
    });
  }, [activeTab, timeframe, searchQuery, appointments]);

  // ── Cancel ───────────────────────────────────────────────────────
  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancelling(id);
    try {
      // Fixed: POST to the same route file (no /cancel sub-path)
      const res  = await fetch("/api/patients/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id, patientID: user.uid }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to cancel");
      setAppointments(prev =>
        prev.map(apt => apt.id === id ? { ...apt, status: "Cancelled" } : apt)
      );
    } catch (e) {
      alert(e.message);
    } finally {
      setCancelling(null);
    }
  };

  const handleViewDetails = (apt) => { setSelectedApt(apt); setIsDetailsOpen(true); };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12 font-sans">

      {/* Header */}
      <div className="bg-[#1a365d] text-white pt-10 pb-16 px-6">
        <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
          <Link href="/patient/dashboard" className="hover:text-white transition-colors">
            <span>Patient</span>
          </Link>
          <ChevronRight size={10} />
          <span className="text-white/60">Appointments</span>
        </nav>
        <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Appointments</h1>
            <p className="text-teal-300 text-sm mt-1">Manage your upcoming visits and view medical history.</p>
          </div>
          <Link
            href="/clinics"
            className="bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl shadow-teal-900/40 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Book New
          </Link>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 mt-6 space-y-6">

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit shadow-sm">
            {["Upcoming", "Past"].map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                  timeframe === t ? "bg-[#1a365d] text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search clinic or doctor..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-teal-500" size={28} />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-5 py-4">
            {error}
          </div>
        )}

        {/* List */}
        {!loading && !error && (
          <section className="space-y-3">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(apt => (
                <div
                  key={apt.id}
                  className="bg-white p-5 border border-slate-200 shadow-sm hover:border-teal-500 transition-all group rounded-2xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                        apt.status === "Cancelled" ? "bg-red-50 text-red-400" : "bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600"
                      }`}>
                        <Calendar size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800">{apt.clinicName || apt.clinic}</h3>
                          <StatusBadge status={apt.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {apt.doctorName || apt.doctor} · {apt.service}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                            <Clock size={12} /> {apt.date} at {apt.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-auto md:ml-0">
                      {apt.status !== "Cancelled" && apt.status !== "Completed" && !apt.isPast && (
                        <button
                          onClick={() => handleCancel(apt.id)}
                          disabled={cancelling === apt.id}
                          className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                        >
                          {cancelling === apt.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(apt)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white py-20 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <Clipboard className="text-slate-200 mx-auto mb-4" size={32} />
                <p className="text-slate-500 font-bold">No {timeframe.toLowerCase()} appointments found.</p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* ── MODAL: VIEW DETAILS ── */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Appointment Summary"
      >
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <h3 className="text-xl font-black text-slate-900">{selectedApt?.clinicName || selectedApt?.clinic}</h3>
            <p className="text-xs font-bold text-teal-600 uppercase mt-1">{selectedApt?.doctorName || selectedApt?.doctor}</p>
          </div>
          <div className="space-y-3">
            {[
              ["Service",    selectedApt?.service],
              ["Date & Time", `${selectedApt?.date} at ${selectedApt?.time}`],
              ["Status",     selectedApt?.status],
              ["Location",   selectedApt?.clinicCity || "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-400">{label}</span>
                <span className={`font-bold ${label === "Status" ? statusColor(selectedApt?.status) : "text-slate-700"}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsDetailsOpen(false)}
            className="w-full bg-[#1a365d] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest"
          >
            Close Summary
          </button>
        </div>
      </Modal>
    </main>
  );
}

// ── Helpers ──────────────────────────────────────────────────────
function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function statusColor(status) {
  switch (status) {
    case "Confirmed": return "text-teal-600";
    case "Pending":   return "text-amber-600";
    case "Cancelled": return "text-red-500";
    case "Completed": return "text-slate-500";
    default:          return "text-slate-700";
  }
}

function StatusBadge({ status }) {
  const styles = {
    Confirmed: "bg-teal-100 text-teal-700",
    Pending:   "bg-amber-100 text-amber-700",
    Cancelled: "bg-red-100 text-red-700",
    Completed: "bg-slate-100 text-slate-500",
  };
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${styles[status] || "bg-slate-100 text-slate-500"}`}>
      {status}
    </span>
  );
}

export default function MyAppointmentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-500" size={28} /></div>}>
      <MyAppointmentsPageInner />
    </Suspense>
  );
}