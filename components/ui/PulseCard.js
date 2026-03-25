// components/ui/PulseCard.js

export default function PulseCard({ title, value, subtext, icon, iconBg, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </p>
        <p className="text-2xl font-black text-slate-800 mt-1">
          {value}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          {subtext}
        </p>
      </div>
      
      <div className={`w-12 h-12 ${iconBg} ${color} rounded-xl flex items-center justify-center text-xl`}>
        {icon}
      </div>
    </div>
  );
}