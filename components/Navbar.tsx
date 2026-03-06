import Link from "next/link";

const navLinks = [
  { href: "/donor", label: "Donor" },
  { href: "/beneficiary", label: "Beneficiary" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  return (
    <header className="border-b border-green-200 bg-white">
      <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-lg font-extrabold text-[#16A34A]">
          Lagos Food Hub
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-[#16A34A] transition hover:bg-[#DCFCE7]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-md border border-[#22C55E] px-3 py-1.5 text-sm font-medium text-[#16A34A] transition hover:bg-[#DCFCE7]"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-[#22C55E] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[#16A34A]"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}
