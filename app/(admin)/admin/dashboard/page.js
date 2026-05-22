"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Activity,
  ShieldCheck,
  Eye,
  UserPlus,
  CalendarCheck,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useClinics } from "@/hooks/useClinics";
import { useAllPatients } from "@/hooks/useAllPatients";
import { useAllBookings } from "@/hooks/useAllBookings";

const STAT_CARDS = [
  { name: "Total Clinics", key: "clinics", icon: Building2, color: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-600" },
  { name: "Total Patients", key: "patients", icon: Users, color: "bg-teal-500", bg: "bg-teal-50", text: "text-teal-600" },
  { name: "Total Bookings", key: "bookings", icon: Calendar, color: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-600" },
  { name: "Pending Approvals", key: "pending", icon: Clock, color: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-600" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { clinics, loading: clinicsLoading } = useClinics("all");
  const { users, loading: usersLoading } = useAllPatients();
  const { bookings, loading: bookingsLoading } = useAllBookings();

  const [stats, setStats] = useState({
    clinics: 0,
    patients: 0,
    bookings: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  
  const capitalizeFirstLetter = (string) => {
  if (!string) return "Admin";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

  useEffect(() => {
    if (clinics && users && bookings) {
      setStats({
        clinics: clinics.length,
        patients: users.length,
        bookings: bookings.length,
        pending: bookings.filter(b => b.status === "pending").length,
        confirmed: bookings.filter(b => b.status === "confirmed").length,
        completed: bookings.filter(b => b.status === "completed").length,
        cancelled: bookings.filter(b => b.status === "cancelled").length,
      });
    }
  }, [clinics, users, bookings]);

  const loading = clinicsLoading || usersLoading || bookingsLoading;

  // Get recent bookings (last 5)
  const recentBookings = bookings?.slice(0, 5) || [];
  
  // Get pending clinics
  const pendingClinics = clinics?.filter(c => c.approved === false) || [];
  
  // Get recent patients (last 5)
  const recentPatients = users?.slice(0, 5) || [];

  const getBookingStatusStyle = (status) => {
    switch (status) {
      case "confirmed": return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "completed": return "bg-teal-50 text-teal-700 border-teal-200";
      case "cancelled": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getFullName = (user) => {
    const firstName = user.firstName || "";
    let middleInitial = user.middleInitial || "";
    const lastName = user.lastName || "";
    
    if (middleInitial) {
      middleInitial = middleInitial.replace(/\./g, "");
      middleInitial = ` ${middleInitial}.`;
    }
    
    return `${firstName}${middleInitial} ${lastName}`.trim() || "Unknown User";
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString("en-US", { 
          month: "short", 
          day: "numeric" 
        });
      }
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
      });
    } catch {
      return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-slate-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Section */}
      {/* Welcome Section */}
<div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-6 text-white">
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-2xl font-bold">
        Welcome back, {capitalizeFirstLetter(user?.firstName) || "Admin"}!
      </h1>
      <p className="text-teal-100 mt-1 text-sm">Here's what's happening with your platform today.</p>
    </div>
    <div className="bg-white/20 rounded-xl px-4 py-2 text-sm">
      <span className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
    </div>
  </div>
</div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key];
          return (
            <div key={card.name} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.name}</p>
                  <p className="text-3xl font-black text-slate-800 mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon size={24} className={card.text} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck size={18} className="text-teal-500" />
              <h3 className="font-bold text-slate-800">Recent Bookings</h3>
            </div>
            <button 
              onClick={() => router.push('/admin/bookings')}
              className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View All <ChevronRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{booking.patientName || "Unknown"}</p>
                      <p className="text-[10px] text-slate-400">{booking.service || "No service"}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-bold uppercase rounded-full px-2 py-0.5 border ${getBookingStatusStyle(booking.status)}`}>
                        {booking.status || "pending"}
                      </span>
                      <p className="text-[9px] text-slate-400 mt-1">{formatDate(booking.date)} at {booking.time}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">
                No bookings yet
              </div>
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500" />
              <h3 className="font-bold text-slate-800">Pending Clinic Approvals</h3>
            </div>
            <button 
              onClick={() => router.push('/admin/pending-clinics')}
              className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Review <ChevronRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingClinics.length > 0 ? (
              pendingClinics.map((clinic) => (
                <div key={clinic.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{clinic.clinicName || clinic.name || "Unnamed"}</p>
                      <p className="text-[10px] text-slate-400">{clinic.city || "No city"} · {clinic.contact || "No contact"}</p>
                    </div>
                    <button 
                      onClick={() => router.push('/admin/pending-clinics')}
                      className="text-[10px] font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-100 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">
                No pending approvals
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-blue-500" />
            <h3 className="font-bold text-slate-800">Recent Patients</h3>
          </div>
          <button 
            onClick={() => router.push('/admin/users')}
            className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            View All <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-5 py-3">Patient Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Bookings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentPatients.length > 0 ? (
                recentPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-[10px] flex items-center justify-center">
                          {getFullName(patient).charAt(0)}
                        </div>
                        <span className="font-semibold text-sm text-slate-800">{getFullName(patient)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">{patient.email || "No email"}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{formatDate(patient.createdAt)}</td>
                    <td className="px-5 py-3 text-xs font-semibold text-slate-700">{patient.bookingsCount || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-slate-400 text-sm">
                    No patients yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button 
          onClick={() => router.push('/admin/clinics')}
          className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition-all hover:border-teal-200 group"
        >
          <Building2 size={20} className="text-slate-400 mx-auto mb-2 group-hover:text-teal-500 transition-colors" />
          <p className="text-xs font-semibold text-slate-700">Manage Clinics</p>
        </button>
        <button 
          onClick={() => router.push('/admin/users')}
          className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition-all hover:border-teal-200 group"
        >
          <Users size={20} className="text-slate-400 mx-auto mb-2 group-hover:text-teal-500 transition-colors" />
          <p className="text-xs font-semibold text-slate-700">Manage Patients</p>
        </button>
        <button 
          onClick={() => router.push('/admin/bookings')}
          className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition-all hover:border-teal-200 group"
        >
          <Calendar size={20} className="text-slate-400 mx-auto mb-2 group-hover:text-teal-500 transition-colors" />
          <p className="text-xs font-semibold text-slate-700">View Bookings</p>
        </button>
        <button 
          onClick={() => router.push('/admin/audit-log')}
          className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition-all hover:border-teal-200 group"
        >
          <Activity size={20} className="text-slate-400 mx-auto mb-2 group-hover:text-teal-500 transition-colors" />
          <p className="text-xs font-semibold text-slate-700">Audit Logs</p>
        </button>
      </div>
    </div>
  );
}