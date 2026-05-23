"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Calendar, Clock, Star, Flag, MessageCircle, Check, CheckCheck, X, ChevronRight, Loader2, Users, FileText } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useNotifications } from "@/hooks/useNotifications";

// Icon per notification type (clinic-specific)
function NotifIcon({ type }) {
  const base = "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white";
  switch (type) {
    case "booking_requested":
      return <div className={`${base} bg-blue-500`}><Calendar size={18} /></div>;
    case "booking_confirmed":
      return <div className={`${base} bg-teal-500`}><CheckCheck size={18} /></div>;
    case "booking_rejected":
      return <div className={`${base} bg-red-400`}><X size={18} /></div>;
    case "appointment_reminder":
      return <div className={`${base} bg-amber-400`}><Clock size={18} /></div>;
    case "new_rating":
    case "new_review":
      return <div className={`${base} bg-yellow-400`}><Star size={18} /></div>;
    case "new_report":
      return <div className={`${base} bg-red-500`}><Flag size={18} /></div>;
    case "new_patient_response":
      return <div className={`${base} bg-purple-500`}><MessageCircle size={18} /></div>;
    case "clinic_response":
      return <div className={`${base} bg-teal-500`}><MessageCircle size={18} /></div>;
    case "patient_registered":
      return <div className={`${base} bg-green-500`}><Users size={18} /></div>;
    case "report_resolved":
      return <div className={`${base} bg-blue-500`}><FileText size={18} /></div>;
    default:
      return <div className={`${base} bg-slate-400`}><Bell size={18} /></div>;
  }
}

// Format time
function formatDateTime(timestamp) {
  if (!timestamp) return "";
  const d = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString("en-PH", { 
    month: "short", 
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function ClinicNotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { notifications, unreadCount, markOne, markAll, loading, refresh } = useNotifications(user?.uid);

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await markOne(notif.id);
    }
    
    // Navigate based on notification type (clinic-specific)
    switch (notif.type) {
      case "booking_requested":
      case "booking_confirmed":
      case "booking_rejected":
      case "appointment_reminder":
        router.push("/clinic/appointments");
        break;
      case "new_rating":
      case "new_review":
        router.push("/clinic/reviews");
        break;
      case "new_report":
        router.push("/clinic/reports");
        break;
      case "new_patient_response":
      case "clinic_response":
        router.push("/clinic/inquiries");
        break;
      case "patient_registered":
        router.push("/clinic/patients");
        break;
      case "report_resolved":
        router.push("/clinic/reports");
        break;
      default:
        if (notif.linkTo) {
          router.push(notif.linkTo);
        }
        break;
    }
  };

  const handleMarkAll = async () => {
    await markAll();
    refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-teal-500 mx-auto mb-3" />
          <p className="text-slate-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-[#1a365d] text-white pt-10 pb-16 px-6">
        <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
          <Link href="/clinic/dashboard" className="hover:text-white transition-colors">
            <span>Clinic</span>
          </Link>
          <ChevronRight size={10} />
          <span className="text-white/60">Notifications</span>
        </nav>
        <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-teal-300 text-sm mt-1">
              Stay updated with clinic alerts and updates
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
            >
              <Check size={16} />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 -mt-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                <Bell size={32} className="text-slate-300" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-600">No notifications yet</p>
                <p className="text-sm text-slate-400 mt-1">When you receive alerts, they'll appear here</p>
              </div>
              <button
                onClick={() => router.push("/clinic/dashboard")}
                className="mt-4 text-sm text-teal-600 font-semibold hover:underline"
              >
                Return to Dashboard →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`px-6 py-5 transition-all cursor-pointer ${
                    !notif.read 
                      ? "hover:bg-blue-50 bg-blue-50/30 border-l-4 border-l-blue-500" 
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <NotifIcon type={notif.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className={`text-sm ${!notif.read ? "font-bold text-slate-800" : "font-semibold text-slate-700"}`}>
                            {notif.title}
                          </p>
                          <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                            {notif.body}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                            <Clock size={10} />
                            {formatDateTime(notif.createdAt)}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {notifications.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-[11px] text-slate-400">
              Showing {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              {unreadCount > 0 && ` · ${unreadCount} unread`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}