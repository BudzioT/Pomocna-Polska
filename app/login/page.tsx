"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
    const parts = digits.match(/.{1,3}/g) ?? [];
    setPhone(parts.join("-"));
  };

  const isPhoneValid = phone.replace(/-/g, "").length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid || !password) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: `+48${phone.replace(/-/g, "")}`,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Nieprawidłowy numer lub hasło.");
        return;
      }

      const userData = await res.json();
      localStorage.setItem("user_id", userData.userId);
      localStorage.setItem("user_name", userData.name);
      localStorage.setItem("user_phone", userData.phoneNumber);
      localStorage.setItem("user_role", userData.role);

      router.push(userData.role === "SEEKER" ? "/new-request" : "/map");
    } catch {
      setError("Błąd sieci. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center w-full max-w-[390px] md:max-w-full mx-auto relative overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#FBFBE2] shadow-sm max-w-[390px] md:max-w-full">
        <Link
          href="/onboarding"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </Link>
        <h1 className="font-headline font-bold text-lg tracking-tight text-primary">Zaloguj się</h1>
        <div className="w-10" />
      </header>

      <main className="w-full px-8 pt-24 pb-12 flex flex-col flex-grow relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #e2beba 1px, transparent 0)",
            backgroundSize: "24px 24px",
            opacity: 0.1,
          }}
        />

        <div className="mb-10 relative z-10">
          <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <span className="material-symbols-outlined text-on-primary-container text-3xl">login</span>
          </div>
          <h2 className="text-3xl font-headline font-extrabold text-on-surface leading-tight">
            Witaj z powrotem
          </h2>
          <p className="text-on-surface-variant mt-3 font-medium">
            Zaloguj się swoim numerem telefonu i hasłem.
          </p>
        </div>

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface px-1">Numer telefonu</label>
            <div className="flex h-14 space-x-3">
              <div className="flex items-center space-x-2 bg-surface-container-highest rounded-xl px-4 shrink-0">
                <span className="font-bold text-on-surface">+48</span>
              </div>
              <div className="relative flex-grow">
                <input
                  className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-4 py-2 text-on-surface font-medium placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none"
                  placeholder="123-456-789"
                  type="tel"
                  inputMode="numeric"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">smartphone</span>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface px-1">Hasło</label>
            <div className="relative">
              <input
                className="w-full h-14 bg-surface-container-highest border-none rounded-xl px-4 pr-14 py-2 text-on-surface font-medium placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-high transition-all outline-none"
                placeholder="Wpisz hasło"
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">{showPass ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            className="w-full h-14 bg-primary text-on-primary font-bold text-lg rounded-xl shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading || !isPhoneValid || !password}
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                <span>Zaloguj się</span>
                <span className="material-symbols-outlined">chevron_right</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-on-surface-variant relative z-10">
          Nie masz konta?{" "}
          <Link href="/role" className="text-primary font-bold hover:underline">
            Zarejestruj się
          </Link>
        </p>
      </main>
    </div>
  );
}
