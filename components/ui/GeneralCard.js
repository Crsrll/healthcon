export default function Card({ children, className = '' }) {
  return (
    <div className="flex"> 
    <aside className={`bg-white rounded-xl border border-gray-100 shadow-md
                     p-4 ${className}`}>
      {children}
    </aside>


    </div>
  );
}