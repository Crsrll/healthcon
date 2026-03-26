"use client";

export default function InquiriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Inquiries</h2>
        <p className="text-xs text-slate-400 mt-0.5">Messages from patients about your clinic</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-150">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100">
            <input placeholder="Search inquiries..." className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-400 transition-colors" />
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
            {[
              { id: 1, user: 'Peter Parker', initials: 'PP', msg: 'Are you open on Saturdays?',       time: '10 mins ago', unread: true,  active: true  },
              { id: 2, user: 'Diana Prince', initials: 'DP', msg: 'Can I reschedule my check-up?',    time: '1 hour ago',  unread: true,  active: false },
              { id: 3, user: 'Clark Kent',   initials: 'CK', msg: 'What are your available slots?',   time: '3 hours ago', unread: false, active: false },
              { id: 4, user: 'Natasha R.',   initials: 'NR', msg: 'Is Dr. Villanueva available Mon?', time: 'Yesterday',   unread: false, active: false },
              { id: 5, user: 'Tony Stark',   initials: 'TS', msg: 'Do you accept PhilHealth?',        time: 'Yesterday',   unread: false, active: false },
            ].map(inq => (
              <div key={inq.id} className={`p-4 cursor-pointer transition-colors ${inq.active ? 'bg-teal-50 border-l-2 border-teal-500' : 'hover:bg-slate-50 border-l-2 border-transparent'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${inq.unread ? 'bg-healthcon-blue text-white' : 'bg-slate-100 text-slate-500'}`}>{inq.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-bold truncate ${inq.unread ? 'text-slate-800' : 'text-slate-500'}`}>{inq.user}</p>
                      <span className="text-[9px] text-slate-400 shrink-0 ml-1">{inq.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{inq.msg}</p>
                  </div>
                  {inq.unread && <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0 mt-1" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-healthcon-blue text-white font-bold text-xs flex items-center justify-center">PP</div>
            <div>
              <p className="font-bold text-sm text-slate-800">Peter Parker</p>
              <p className="text-[10px] text-slate-400">10 minutes ago</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-slate-50/40">
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 max-w-sm shadow-sm">
                <p className="text-sm text-slate-700">Are you open on Saturdays?</p>
                <p className="text-[10px] text-slate-400 mt-1">10:14 AM</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-healthcon-blue rounded-2xl rounded-tr-none px-4 py-3 max-w-sm">
                <p className="text-sm text-white">Yes, we are open on Saturdays from 8:00 AM to 12:00 PM.</p>
                <p className="text-[10px] text-blue-200 mt-1">10:17 AM · You</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 max-w-sm shadow-sm">
                <p className="text-sm text-slate-700">Great! Can I book for this Saturday morning?</p>
                <p className="text-[10px] text-slate-400 mt-1">10:18 AM</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3">
            <input placeholder="Type a reply..." className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 transition-colors bg-slate-50" />
            <button className="bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0">Send</button>
          </div>
        </div>
      </div>
    </main>
  );
}