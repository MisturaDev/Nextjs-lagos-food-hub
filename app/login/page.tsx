"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "donor" | "beneficiary" | "volunteer" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("donor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = (await response.json()) as {
        error?: string;
        user?: { role: Role };
      };

      if (!response.ok || !data.user) {
        setError(data.error ?? "Login failed.");
        return;
      }

      router.push(`/${data.user.role}`);
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-xl border border-green-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#16A34A]">Login</h1>
        <p className="mt-1 text-sm text-slate-600">Sign in to your Lagos Food Hub account.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-green-200 px-3 py-2 text-sm outline-none ring-[#22C55E] focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-green-200 px-3 py-2 text-sm outline-none ring-[#22C55E] focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700">
              Login As
            </label>
            <select
              id="role"
              className="w-full rounded-md border border-green-200 px-3 py-2 text-sm outline-none ring-[#22C55E] focus:ring-2"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="donor">Donor</option>
              <option value="beneficiary">Beneficiary</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <p className="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-amber-800">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
