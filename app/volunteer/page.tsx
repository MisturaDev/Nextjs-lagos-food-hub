import { requireRole } from "@/lib/auth/session";

export default async function VolunteerDashboard() {
  await requireRole("volunteer");

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl items-center justify-center px-4 py-10">
      <section className="w-full rounded-xl border border-green-200 bg-white p-6 shadow-sm md:p-10">
        <h1 className="text-2xl font-bold text-[#16A34A] md:text-3xl">Volunteer Dashboard</h1>
        <p className="mt-2 text-base text-slate-700">
          Phase 2: Login/Register + Task assignment board coming soon.
        </p>
      </section>
    </main>
  );
}
