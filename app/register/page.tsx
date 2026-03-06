"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "donor" | "beneficiary" | "volunteer" | "admin";

type RegisterState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: Role;
};

const initialState: RegisterState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "donor",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterState>(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          password: form.password,
          role: form.role,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Registration failed.");
        return;
      }

      router.push(`/${form.role}`);
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
        <h1 className="text-2xl font-bold text-[#16A34A]">Create an Account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Register as Donor, Beneficiary, Volunteer, or Admin.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id="name"
              className="w-full rounded-md border border-green-200 px-3 py-2 text-sm outline-none ring-[#22C55E] focus:ring-2"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-green-200 px-3 py-2 text-sm outline-none ring-[#22C55E] focus:ring-2"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
              Phone (optional)
            </label>
            <input
              id="phone"
              className="w-full rounded-md border border-green-200 px-3 py-2 text-sm outline-none ring-[#22C55E] focus:ring-2"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              id="role"
              className="w-full rounded-md border border-green-200 px-3 py-2 text-sm outline-none ring-[#22C55E] focus:ring-2"
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as Role }))}
            >
              <option value="donor">Donor</option>
              <option value="beneficiary">Beneficiary</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-green-200 px-3 py-2 text-sm outline-none ring-[#22C55E] focus:ring-2"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full rounded-md border border-green-200 px-3 py-2 text-sm outline-none ring-[#22C55E] focus:ring-2"
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            />
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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </section>
    </main>
  );
}
