"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const r = useRouter();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");

  async function onSubmit(e: any) {
    e.preventDefault();
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); return; }
    r.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="card p-6 w-full max-w-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-lg">👑</span>
          </div>
          <div className="text-lg font-bold">Audit King</div>
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <input className="input w-full" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Password</label>
          <input type="password" className="input w-full" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {err && <div className="text-sm text-red-600">{err}</div>}
        <button className="btn w-full" type="submit">Sign in</button>
      </form>
    </div>
  );
}
