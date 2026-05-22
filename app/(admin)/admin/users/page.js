"use client"
import { Suspense } from "react";;
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Eye, ShieldMinus, ShieldCheck, Loader2, X, Calendar, Clock, Mail, Phone } from "lucide-react";
import { useAllPatients } from "@/hooks/useAllPatients";
import { useAuth } from "@/context/authContext";

const STATUS_STYLE = {
  active: "bg-teal-50 text-teal-700 border-teal-200",
  suspended: "bg-red-50 text-red-600 border-red-200",
};

function UsersPageInner() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const { user } = useAuth();
  const { users, loading, suspendUser, reinstateUser } = useAllPatients(user);

  const [search, setSearch] = useState(urlQuery);
  const [tab, setTab] = useState("All");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // ADD THIS

  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  const handleStatusUpdate = async (userId, action, userName) => {
    setActionLoading(userId);
    let result;
    
    if (action === "suspend") {
      result = await suspendUser(userId, userName);
    } else if (action === "reinstate") {
      result = await reinstateUser(userId, userName);
    }
    
    setActionLoading(null);
    
    if (!result?.success) {
      alert(`Failed to ${action}: ${result?.error || "Unknown error"}`);
    }
  };

  const getUserStatus = (user) => {
    if (user.suspended === true) return "suspended";
    return "active";
  };

const getFullName = (user) => {
  const firstName = user.firstName || "";
  const middleInitial = user.middleInitial 
    ? ` ${user.middleInitial.replace(/\./g, "")}.` 
    : "";
  const lastName = user.lastName || "";
  
  return `${firstName}${middleInitial} ${lastName}`.trim() || "Unknown User";
};

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString("en-US", { 
          month: "short", 
          day: "numeric", 
          year: "numeric" 
        });
      }
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric" 
      });
    } catch {
      return "Unknown";
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "Unknown";
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
      }
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return "Unknown";
    }
  };

  const filtered = users.filter((user) => {
    const q = search.toLowerCase();
    const fullName = getFullName(user).toLowerCase();
    const email = (user.email || "").toLowerCase();
    const id = user.id.toLowerCase();
    
    const matchSearch = fullName.includes(q) || email.includes(q) || id.includes(q);
    const status = getUserStatus(user);
    const matchTab = tab === "All" || status === tab.toLowerCase();

    return matchSearch && matchTab;
  });

  const activeCount = users.filter((u) => getUserStatus(u) === "active").length;
  const suspendedCount = users.filter((u) => getUserStatus(u) === "suspended").length;

  if (loading) {
    return (
      <main className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-teal-500 mx-auto mb-3" />
          <p className="text-slate-500">Loading users...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-500">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">User Directory</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              {users.length} Total Registered · {activeCount} Active Patients · {suspendedCount} Suspended
            </p>
          </div>
          
          {search && (
            <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                Search: <span className="text-slate-800">"{search}"</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 min-w-[280px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or User ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-400 transition-all"
            />
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {["All","Active","Suspended"].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-xs font-bold px-4 py-2 rounded-lg transition-all uppercase tracking-tighter
                            ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-center">Bookings</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length > 0 ? (
                  filtered.map((user) => {
                    const status = getUserStatus(user);
                    const fullName = getFullName(user);
                    const email = user.email || "No email";
                    const joinedDate = formatDate(user.createdAt);
                    const bookings = user.bookingsCount || user.bookings || 0;
                    
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center shrink-0 border border-blue-100 uppercase">
                              {fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-800">{fullName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase">
                          {joinedDate}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <p className="text-sm font-black text-slate-700">{bookings}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-[10px] font-black uppercase rounded-full px-3 py-1 border ${STATUS_STYLE[status]}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setSelectedUser(user)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                              title="View Profile"
                            >
                              <Eye size={18} />
                            </button>
                            {status === 'active' ? (
                              <button 
                                onClick={() => handleStatusUpdate(user.id, "suspend", fullName)}
                                disabled={actionLoading === user.id}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50" 
                                title="Suspend User">
                                {actionLoading === user.id ? <Loader2 size={18} className="animate-spin" /> : <ShieldMinus size={18} />}
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleStatusUpdate(user.id, "reinstate", fullName)}
                                disabled={actionLoading === user.id}
                                className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all disabled:opacity-50" 
                                title="Reinstate User">
                                {actionLoading === user.id ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-slate-400 italic text-sm">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal - User Details */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* User Avatar and Name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 font-black text-2xl flex items-center justify-center">
                  {getFullName(selectedUser).split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800">{getFullName(selectedUser)}</h4>
                  <span className={`text-[10px] font-black uppercase rounded-full px-3 py-1 border inline-block mt-1 ${STATUS_STYLE[getUserStatus(selectedUser)]}`}>
                    {getUserStatus(selectedUser)}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-3">Contact Information</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-slate-400" />
                    <div>
                      <p className="text-[9px] text-slate-400">Email Address</p>
                      <p className="text-sm text-slate-700 break-all">{selectedUser.email || "No email"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-slate-400" />
                    <div>
                      <p className="text-[9px] text-slate-400">Phone Number</p>
                      <p className="text-sm text-slate-700">{selectedUser.phone || selectedUser.contact || "No phone"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-3">Account Information</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-slate-400" />
                    <div>
                      <p className="text-[9px] text-slate-400">Joined Date</p>
                      <p className="text-sm text-slate-700">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-slate-400" />
                    <div>
                      <p className="text-[9px] text-slate-400">User ID</p>
                      <p className="text-xs text-slate-500 font-mono break-all">{selectedUser.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-3">Statistics</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-slate-800">{selectedUser.bookingsCount || selectedUser.bookings || 0}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Total Bookings</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-slate-800">{selectedUser.visitsCount || 0}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Total Visits</p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              {selectedUser.createdAt && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-[9px] text-slate-400">
                    Account created: {formatDateTime(selectedUser.createdAt)}
                  </p>
                  {selectedUser.updatedAt && (
                    <p className="text-[9px] text-slate-400 mt-1">
                      Last updated: {formatDateTime(selectedUser.updatedAt)}
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors mt-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersPageInner />
    </Suspense>
  );
}
