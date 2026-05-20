"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, X, Check, Clock, Building2, Flag, Settings, CheckCircle } from "lucide-react";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";

function NotifIcon({ type }) {
  const base = "w-8 h-8 rounded-xl flex items-center justify-center shrink-0";
  switch (type) {
    case "pending_clinic":
      return <div className={`${base} bg-amber-500`}><Building2 size={15} className="text-white" /></div>;
    case "new_report":
      return <div className={`${base} bg-red-500`}><Flag size={15} className="text-white" /></div>;
    case "admin_action":
      return <div className={`${base} bg-blue-500`}><Settings size={15} className="text-white" /></div>;
    case "clinic_approved":
      return <div className={`${base} bg-teal-500`}><CheckCircle size={15} className="text-white" /></div>;
    case "clinic_rejected":
      return <div className={`${base} bg-red-500`}><X size={15} className="text-white" /></div>;
    case "report_resolved":
      return <div className={`${base} bg-green-500`}><Check size={15} className="text-white" /></div>;
    case "user_suspended":
      return <div className={`${base} bg-red-500`}><X size={15} className="text-white" /></div>;
    case "user_reinstated":
      return <div className={`${base} bg-teal-500`}><CheckCircle size={15} className="text-white" /></div>;
    default:
      return <div className={`${base} bg-slate-400`}><Bell size={15} className="text-white" /></div>;
  }
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function AdminNotificationBell({ adminId }) {
  const router = useRouter();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useAdminNotifications(adminId);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await markAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.linkTo) {
      router.push(notif.linkTo);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-teal-600 transition-colors rounded-lg hover:bg-slate-100"
        aria-label="Admin Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-800">Admin Alerts</h3>
              {unreadCount > 0 && (
                <span className="bg-teal-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] text-teal-600 hover:text-teal-700 font-semibold"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Bell size={20} className="text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-500">No admin alerts</p>
                <p className="text-xs text-slate-400 mt-1">New alerts will appear here</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-slate-50
                    ${!notif.read ? "bg-blue-50/30 border-l-4 border-l-teal-500" : "border-l-4 border-l-transparent"}`}
                >
                  <NotifIcon type={notif.type} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${!notif.read ? "font-bold text-slate-800" : "font-medium text-slate-600"}`}>
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{notif.body}</p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={9} />
                      {formatTimeAgo(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1 shrink-0" />}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
              <p className="text-[9px] text-slate-400 text-center">
                Admin system notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}