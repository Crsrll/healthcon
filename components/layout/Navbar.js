import Link from "next/link";

export default function Navbar() {
  const links = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Clinics", href: "/clinics" }
  ];

  return (
    <nav className="bg-[#1a365d] p-4 flex items-center text-sm font-medium">
      
      {/* LEFT: Logo */}
      <Link href="/" className="text-[#f7fafc] text-xl font-bold flex gap-0 items-center">
      <img src="./logo.png" alt="Healthcon Logo" className="inline-block w-8 h-8 mr-2" />
        Health<span className="text-[#b2f5ea]">con</span>
      </Link>

      {/* CENTER: Nav Links */}
      <ul className="flex space-x-6 mx-auto">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-[#f7fafcb3] hover:text-[#b2f5ea] transition-colors duration-300"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* RIGHT: Login */}
      <Link
        href="./auth/login"
        className="text-[#1a365d] bg-[#b2f5ea] hover:bg-[#b2f5eac2] px-3 py-1.5 rounded-xl"
      >
        Login
      </Link>

    </nav>
  );
}