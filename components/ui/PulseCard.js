// components/ui/PulseCard.js

export default function PulseCard({ title, value, subtext, icon, iconBg, color, border="", valueClass = "text-3xl"}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all group cursor-default">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </p>
        <p className={`font-black text-slate-800 mt-1 leading-none ${valueClass}`}>
          {value}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          {subtext}
        </p>
      </div>
      
      <div className={`w-12 h-12 ${iconBg} ${color} ${border} rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110`}>
        {icon}
      </div>
    </div>
  );
}