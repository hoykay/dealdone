"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const supabase = createClient();

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        throw signInError;
      }

      router.push("/deals/dd-1048/settlement");
      router.refresh();
    } catch (err) {
      console.error("Login failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF9FC] px-6 py-16">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="rounded-[16px] border border-[#E8E4EE] bg-white p-8 shadow-sm">
          <div className="mb-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#918A98]">
              DealDone
            </p>

            <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.02em] text-[#302A42]">
              Sign in to approve
            </h1>

            <p className="mt-2 text-[14px] leading-6 text-[#837C8C]">
              Your identity determines which side of the
              settlement you are authorized to approve.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[12px] font-semibold text-[#524B60]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="h-[44px] w-full rounded-[9px] border border-[#DDD8E5] bg-white px-3 text-[14px] text-[#302A42] outline-none transition focus:border-[#4D35F3]"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[12px] font-semibold text-[#524B60]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="h-[44px] w-full rounded-[9px] border border-[#DDD8E5] bg-white px-3 text-[14px] text-[#302A42] outline-none transition focus:border-[#4D35F3]"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <p className="rounded-[9px] bg-[#FFF0F4] px-3 py-2 text-[12px] font-medium text-[#C53E66]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-[44px] w-full items-center justify-center rounded-[9px] bg-[#4D35F3] text-[13px] font-semibold text-white transition hover:bg-[#3E29DB] disabled:cursor-not-allowed disabled:bg-[#BBB5C8]"
            >
              {loading
                ? "Signing in…"
                : "Continue"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] text-[#9A93A3]">
          Approval permissions are enforced server-side.
        </p>
      </div>
    </main>
  );
}