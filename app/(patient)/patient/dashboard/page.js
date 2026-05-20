"use client";
import { useAuth } from "@/context/authContext";
import { usePatientDashboard } from "@/hooks/usePatientDashboard";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  Bell, 
  CalendarCheck, 
  ChevronRight, 
  Activity,
  MapPin,
  MessageSquare,
  User,
  Star,
  FileText,
  Pill,
  Heart,
  Shield,
  ArrowRight
} from "lucide-react";

function getStatusStyle(status) {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "Unknown";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const { dashboard, loading, error, refresh } = usePatientDashboard(user?.uid);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-slate-500 mt-4 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center bg-red-50 rounded-2xl p-8 max-w-md">
          <p className="text-red-600 font-medium">Error loading dashboard</p>
          <p className="text-sm text-red-500 mt-1">{error}</p>
          <button onClick={refresh} className="mt-4 text-sm text-red-700 underline font-medium">
            Try again
          </button>
        </div>
      </div>
    );
  }

  const { user: userData, upcomingBookings, recentNotifications, stats } = dashboard;

  // Navigation cards data
  const navCards = [
    { name: "Find Clinics", href: "/clinics", icon: MapPin, color: "text-teal-600", bg: "bg-teal-50", description: "Search and book appointments" },
    { name: "My Appointments", href: "/patient/appointments", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50", description: "View your schedule" },
    { name: "Inquiries", href: "/patient/messages", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50", description: "Messages & replies" },
    { name: "Medical Records", href: "/patient/medical-records", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50", description: "Health history" },
    { name: "Prescriptions", href: "/patient/prescriptions", icon: Pill, color: "text-rose-600", bg: "bg-rose-50", description: "Active medications" },
    { name: "My Profile", href: "/patient/profile", icon: User, color: "text-slate-600", bg: "bg-slate-100", description: "Personal info" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section - Full Width */}
      <div className="relative bg-gradient-to-r from-teal-700 via-teal-600 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-teal-200 text-xs font-bold uppercase tracking-wider">Patient Portal</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                Welcome back, {userData?.firstName || "Patient"}!
              </h1>
              <p className="text-teal-100 mt-2 text-lg">Your health journey continues here.</p>
            </div>
            
            {/* Stats Summary */}
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 text-center border border-white/20">
                <p className="text-2xl font-bold text-white">{stats.upcomingBookings}</p>
                <p className="text-[10px] text-teal-200 uppercase font-bold tracking-wider">Upcoming</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 text-center border border-white/20">
                <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
                <p className="text-[10px] text-teal-200 uppercase font-bold tracking-wider">All Bookings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{stats.totalBookings}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                <Calendar size={22} className="text-teal-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Upcoming</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{stats.upcomingBookings}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <CalendarCheck size={22} className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{stats.completedBookings || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <Activity size={22} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-2">
                  <CalendarCheck size={20} className="text-teal-600" />
                  <h3 className="font-bold text-slate-800">Upcoming Appointments</h3>
                </div>
                <Link href="/patient/appointments" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                  View All <ChevronRight size={14} />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <div key={booking.id} className="px-6 py-5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">
                            {booking.doctorName || "Doctor"}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-slate-400" />
                              <p className="text-xs text-slate-600">{formatDate(booking.date)}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-slate-400" />
                              <p className="text-xs text-slate-600">{booking.time || "TBA"}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Stethoscope size={14} className="text-slate-400" />
                              <p className="text-xs text-slate-600">{booking.service || "General Check-up"}</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 mt-2">{booking.clinicName || "Clinic"}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase rounded-full px-3 py-1 ${getStatusStyle(booking.status)}`}>
                          {booking.status || "pending"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Calendar size={28} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No upcoming appointments</p>
                    <Link href="/clinics" className="inline-block mt-3 text-sm text-teal-600 font-semibold hover:underline">
                      Book your first appointment →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Star size={18} className="text-amber-500" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {navCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all hover:border-teal-200 group"
                    >
                      <div className={`${item.bg} ${item.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon size={18} />
                      </div>
                      <p className="font-bold text-sm text-slate-700">{item.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{item.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Health Tip Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Heart size={18} className="text-teal-200" />
                  <p className="text-teal-200 text-[10px] font-black uppercase tracking-wider">Daily Health Tip</p>
                </div>
                <p className="text-sm font-semibold leading-relaxed">
                  Stay hydrated — drink at least 8 glasses of water daily for optimal kidney function.
                </p>
                <a
                  href="https://www.healthline.com/nutrition/how-much-water-should-you-drink-per-day"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold text-teal-200 hover:text-white transition-colors group"
                >
                  Read More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-800">Recent Alerts</h3>
                  {stats.unreadNotifications > 0 && (
                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {stats.unreadNotifications}
                    </span>
                  )}
                </div>
                <Link href="/patient/notifications" className="text-[10px] font-bold text-teal-600 hover:text-teal-700">
                  View All
                </Link>
              </div>
              <div className="divide-y divide-slate-100 max-h-90 overflow-y-auto">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notif) => (
                    <div key={notif.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${!notif.read ? "bg-teal-500" : "bg-slate-300"}`} />
                        <div className="flex-1">
                          <p className={`text-xs ${!notif.read ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                            {notif.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{notif.body}</p>
                          <p className="text-[9px] text-slate-400 mt-1">{formatTimeAgo(notif.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-8 text-center">
                    <Bell size={24} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No new notifications</p>
                    <p className="text-[10px] text-slate-400 mt-1">You're all caught up!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}