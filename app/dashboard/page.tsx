import Link from "next/link";
import { Badge } from "@/components/Badge";
import { masteryFromStats } from "@/lib/types";
import { sampleTopics } from "@/lib/sample-data";

export default function StudentDashboard() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Student Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {sampleTopics.map((topic, i) => {
          const attempts = i * 2;
          const pct = 50 + i * 10;
          const status = masteryFromStats(attempts, pct);
          return (
            <div key={topic.id} className="card">
              <div className={`mb-3 inline-block rounded-lg px-2 py-1 text-xs ${topic.color}`}>{topic.name}</div>
              <p className="mb-3 text-sm text-slate-600">{topic.description}</p>
              <div className="mb-3 flex items-center justify-between">
                <Badge status={status} />
                <span className="text-sm">{pct}%</span>
              </div>
              <div className="h-2 rounded bg-slate-200"><div className="h-2 rounded bg-blue-600" style={{ width: `${pct}%` }} /></div>
              <Link href={`/practice/${topic.id}`} className="mt-3 inline-block rounded-xl bg-blue-600 px-3 py-2 text-sm text-white">Practice</Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
