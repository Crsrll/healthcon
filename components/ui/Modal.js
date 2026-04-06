export default function Modal({ isOpen, onClose, title, children, className = "rounded-3xl" }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Use the className prop here. Default is rounded-3xl if you don't provide one */}
      <div className={`relative bg-white shadow-2xl max-w-lg w-full overflow-hidden transition-all ${className}`}>
        <div className="px-6 py-7 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}