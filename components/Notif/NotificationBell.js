"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, X, Check, CheckCheck, Calendar, Star, Clock, Flag, MessageCircle } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

// ── Icon per notification type ───────────────────────────────
function NotifIcon({ type }) {
  const base = "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white";
  switch (type) {
    case "booking_requested":
      return <div className={`${base} bg-blue-500`}><Calendar size={15} /></div>;
    case "booking_confirmed":
      return <div className={`${base} bg-teal-500`}><CheckCheck size={15} /></div>;
    case "booking_rejected":
      return <div className={`${base} bg-red-400`}><X size={15} /></div>;
    case "appointment_reminder":
      return <div className={`${base} bg-amber-400`}><Clock size={15} /></div>;
    case "new_rating":
      return <div className={`${base} bg-yellow-400`}><Star size={15} /></div>;
    // Report notification types
    case "new_report":
      return <div className={`${base} bg-red-500`}><Flag size={15} /></div>;
    case "new_review":
      return <div className={`${base} bg-yellow-500`}><Star size={15} /></div>;
    case "new_patient_response":
      return <div className={`${base} bg-purple-500`}><MessageCircle size={15} /></div>;
    case "clinic_response":
      return <div className={`${base} bg-teal-500`}><MessageCircle size={15} /></div>;
    default:
      return <div className={`${base} bg-slate-400`}><Bell size={15} /></div>;
  }
}

// ── Relative time helper ─────────────────────────────────────
function formatTime(ts) {
  if (!ts) return "";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

// ── Main component ───────────────────────────────────────────
export default function NotificationBell({ uid }) {
  const router = useRouter();
  const { notifications, unreadCount, markOne, markAll, loading } = useNotifications(uid);

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = async (notif) => {
    if (!notif.read) await markOne(notif.id);
    setOpen(false);
    if (notif.linkTo) router.push(notif.linkTo);
  };

  return (
    <div className="relative" ref={ref}>

      {/* ── Bell button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-1 text-slate-300 hover:text-teal-300 transition-colors"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-navy-dark" />
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="absolute right-0 mt-2 w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 z-50"
          style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}>

          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm text-[#1a355d]">Notifications</p>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAll}
                className="text-[11px] font-bold text-slate-700 hover:text-teal-700 flex items-center gap-1 transition-colors"
              >
                <Check size={12} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#1a355d] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3 text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Bell size={22} className="text-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400">All caught up!</p>
                  <p className="text-xs text-slate-300 mt-1">New notifications will appear here</p>
                </div>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors border-b border-slate-50 last:border-0
                  ${notif.read 
                    ? "hover:bg-slate-50 border-l-4 border-l-transparent" 
                    : "bg-slate-50 hover:bg-slate-100 border-l-4 border-l-[#1a355d]"}`}
                >
                  <NotifIcon type={notif.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs leading-snug ${notif.read ? "font-medium text-slate-600" : "font-bold text-slate-800"}`}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                      {notif.body}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                      <Clock size={9} />
                      {formatTime(notif.createdAt)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-[10px] text-slate-400 text-center">
                Showing last {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}