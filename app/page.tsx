import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl items-center justify-center px-4 py-10">
      <section className="w-full rounded-xl border border-green-200 bg-white p-8 shadow-sm md:p-12">
        <h1 className="text-3xl font-bold text-[#16A34A] md:text-4xl">Lagos Food Hub</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Connecting surplus food to communities in need across Lagos. Phase 2 adds role-based
          registration and login for donors, beneficiaries, volunteers, and admins.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-md bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D]"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-[#22C55E] px-4 py-2 text-sm font-semibold text-[#16A34A] hover:bg-[#DCFCE7]"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
