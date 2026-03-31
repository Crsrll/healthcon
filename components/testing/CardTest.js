export default function CardTest({children, title, description, image, className, style}){
  return(
    <div className={`bg-white rounded-2xl shadow-lg border border-slate-200 p-6 ${className}`} style={style}>
      {image && <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-2xl mb-4" />}
      {title && <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>}
      {description && <p className="text-slate-600 text-sm mb-2">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}