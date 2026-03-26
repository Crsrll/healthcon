export default function GeneralCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
}