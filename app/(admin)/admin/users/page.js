<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
  {/* Search input */}
  <div className="relative">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
    <input 
      value={search} 
      onChange={e => setSearch(e.target.value)}
      placeholder="Search by name, email, or User ID..."
      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-400 transition-all"
    />
  </div>
  
  {/* Filter buttons - takes full width on mobile, auto on desktop */}
  <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
    {["All","Active","Suspended"].map((t) => (
      <button key={t} onClick={() => setTab(t)}
        className={`flex-1 text-xs font-bold px-4 py-2 rounded-lg transition-all uppercase tracking-tighter text-center
                    ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
        {t}
      </button>
    ))}
  </div>
</div>