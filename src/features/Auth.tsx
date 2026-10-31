"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/accountServices";
import { useStore } from "@/store";
import { BlobBackground, Doodle, FloatingShape, FunkyGradientBackground, GrainOverlay } from "@/components/bg";
import { Sticker } from "@/components/ui/Sticker";

type Mode = "login" | "register" | "forgot";
const copy = {
  login: { h: "WELCOME BACK.", s: "Your wishlist missed you.", bg: "#C6FF3D" },
  register: { h: "JOIN THE CLUB.", s: "Early drops. Secret codes. Zero boring.", bg: "#FF8AC4" },
  forgot: { h: "OOPS, FORGOT?", s: "It happens to the best of us.", bg: "#27E1F5" },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);
  const toast = useStore((s) => s.toast);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const c = copy[mode];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const email = String(d.get("email")), pw = String(d.get("password") ?? "");
    setErr("");
    if (mode !== "forgot" && pw.length < 6) return setErr("Password needs at least 6 characters.");
    setBusy(true);
    try {
      if (mode === "login") { setUser(await authService.login(email, pw)); toast("Welcome back 🔥"); router.push("/account"); }
      else if (mode === "register") { setUser(await authService.register(String(d.get("name")), email, pw)); toast("Account created 🎉"); router.push("/account"); }
      else { await authService.forgotPassword(email); setSent(true); }
    } catch { setErr("Something went off script. Try again."); }
    setBusy(false);
  };

  return (
    <div className="relative isolate overflow-hidden" style={{ background: c.bg }}>
      <FunkyGradientBackground from={c.bg} via="#fff" to="#FFD81F" className="opacity-60" />
      <BlobBackground colors={["#6C2BFF", "#FF2E93", "#FFD81F"]} className="opacity-40" />
      <GrainOverlay />
      <FloatingShape name="star" color="#0B0B0F" size={44} className="left-[8%] top-16" />
      <FloatingShape name="heart" color="#FF2E93" size={40} className="right-[10%] bottom-20" />
      <div className="container-x relative grid min-h-[78vh] place-items-center py-10">
        <div className="relative w-full max-w-md rounded-[1.6rem] border-2 border-ink bg-paper p-6 shadow-popl sm:p-8">
          <Sticker bg="#FFD81F" rotate={8} className="absolute -right-3 -top-4">{mode === "login" ? "HEY YOU" : "NO BORING"}</Sticker>
          <h1 className="display text-5xl">{c.h}</h1>
          <p className="mt-1 text-sm font-medium text-ink/70">{c.s}</p>
          {sent ? (
            <div className="mt-6 rounded-xl border-2 border-ink bg-lime p-4 font-bold" role="status">Reset link on its way. Check your inbox 💌</div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate={false}>
              {mode === "register" && <div><label className="label" htmlFor="name">Full name</label><input id="name" name="name" required autoComplete="name" className="input" placeholder="Your name" /></div>}
              <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="email" className="input" placeholder="you@email.com" /></div>
              {mode !== "forgot" && <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required autoComplete={mode === "login" ? "current-password" : "new-password"} className="input" placeholder="••••••••" /></div>}
              {err && <p role="alert" className="text-sm font-bold text-pink">{err}</p>}
              <button disabled={busy} className="btn btn-pop btn-dark w-full !py-4 !text-lime">{busy ? "HOLD ON…" : mode === "login" ? "LOG IN →" : mode === "register" ? "CREATE ACCOUNT →" : "SEND RESET LINK →"}</button>
            </form>
          )}
          <div className="mt-5 space-y-1 text-center text-sm font-bold">
            {mode === "login" && <><Link href="/forgot-password" className="underline">Forgot password?</Link><p>New here? <Link href="/register" className="text-purple underline">Create an account</Link></p></>}
            {mode === "register" && <p>Already in? <Link href="/login" className="text-purple underline">Log in</Link></p>}
            {mode === "forgot" && <Link href="/login" className="underline">← Back to login</Link>}
          </div>
          <Doodle name="smile" color="#FFD81F" size={40} className="absolute -bottom-5 -left-4 animate-floaty drop-shadow-[2px_2px_0_#0B0B0F]" />
        </div>
      </div>
    </div>
  );
}
