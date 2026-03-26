export default function SidebarWrapper({children, className = '', buttons, mode, setMode}){
  return(
    <div className={`w-56 shrink-0 sticky top-0 h-screen overflow-y-auto bg-white border-r border-gray-200 p-4 ${className}`}>
      {buttons.map((b) => (
         <button key={b.label} className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium
         transition-all flex items-center gap-2 ${mode === b.label
         ? 'bg-[#1a355d] text-white'
         : 'text-gray-500 hover:bg-gray-50'}`} onClick={() => setMode(b.label)}>
          {b.icon}
         {b.label}
         </button>
          ))
       }
       {children}
    </div>
  )
}

