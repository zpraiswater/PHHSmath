import Link from "next/link";

export default function HomePage() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="card">
        <h1 className="mb-3 text-3xl font-bold">College Algebra Final Review Dashboard</h1>
        <p className="mb-4 text-slate-600">2-week review app with topic practice, mastery tracking, and teacher tools.</p>
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>Students practice by topic and get instant feedback.</li>
          <li>Mastery badges update from attempts.</li>
          <li>Teacher can manage topics and question bank.</li>
        </ul>
        <div className="flex gap-3">
          <Link href="/login" className="rounded-xl bg-blue-600 px-4 py-2 text-white">Login</Link>
          <Link href="/dashboard" className="rounded-xl border px-4 py-2">Demo Dashboard</Link>
        </div>
      </div>
      <div className="card">
        <h2 className="mb-2 text-xl font-semibold">How login works</h2>
        <p className="text-sm text-slate-600">Use Supabase email/password or magic link authentication. Role is stored in <code>profiles.role</code> (student or teacher).</p>
      </div>
    </section>
  );
}
