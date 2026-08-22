"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const supabaseClient = supabase;
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Login successful. Visit dashboard.");
  }

  return (
    <div className="mx-auto max-w-md card">
      <h1 className="mb-4 text-2xl font-bold">Student / Teacher Login</h1>
      <form onSubmit={handleLogin} className="space-y-3">
        <input className="w-full rounded-xl border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full rounded-xl border p-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full rounded-xl bg-blue-600 p-2 text-white">Log In</button>
      </form>
      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
    </div>
  );
}
