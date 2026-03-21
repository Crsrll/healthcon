import Link from "next/link";

export default function Navbar() {
  const links = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Clinics", href: "/clinics" }
  ];

  return (
    <nav className="bg-white-800 p-4 flex items-center">
      
      {/* LEFT: Logo */}
      <Link href="/" className="text-black text-lg font-bold">
        Healthcon
      </Link>

      {/* CENTER: Nav Links */}
      <ul className="flex space-x-6 mx-auto">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-black-300 hover:text-black"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* RIGHT: Login */}
      <Link
        href="./auth/login"
        className="text-white hover:text-white bg-blue-500 px-3 py-1 rounded-xl"
      >
        Login
      </Link>

    </nav>
  );
}