export default function AdminDashboardPage() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Teacher/Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><h2 className="font-semibold">Avg Mastery by Topic</h2><p className="text-sm text-slate-600">Factoring: 72% | Functions: 68%</p></div>
        <div className="card"><h2 className="font-semibold">Students Needing Help</h2><p className="text-sm text-slate-600">12 students below 60% in 2+ topics.</p></div>
        <div className="card"><h2 className="font-semibold">Attempts per Topic</h2><p className="text-sm text-slate-600">Linear: 130 | Logs: 85</p></div>
      </div>
    </section>
  );
}
