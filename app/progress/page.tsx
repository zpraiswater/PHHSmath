import { sampleTopics } from "@/lib/sample-data";

export default function ProgressPage() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">My Progress</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b"><th>Topic</th><th>Attempts</th><th>Accuracy</th><th>Mastery</th></tr></thead>
          <tbody>
            {sampleTopics.map((t, i) => (
              <tr key={t.id} className="border-b">
                <td className="py-2">{t.name}</td><td>{i * 3}</td><td>{55 + i * 10}%</td><td>{i === 0 ? "Developing" : i < 3 ? "Almost There" : "Mastered"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
