export default function AdminContentPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Manage Topics & Questions</h1>
      <div className="card">
        <h2 className="mb-2 font-semibold">Manual Question Entry</h2>
        <p className="mb-3 text-sm text-slate-600">Version 1 includes manual entry and edit/delete hooks. CSV upload can be added in a later sprint.</p>
        <form className="grid gap-2 md:grid-cols-2">
          <input className="rounded border p-2" placeholder="topic_id" />
          <input className="rounded border p-2" placeholder="question_text" />
          <input className="rounded border p-2" placeholder="answer_choice_a" />
          <input className="rounded border p-2" placeholder="answer_choice_b" />
          <input className="rounded border p-2" placeholder="answer_choice_c" />
          <input className="rounded border p-2" placeholder="answer_choice_d" />
          <input className="rounded border p-2" placeholder="correct_answer (A/B/C/D)" />
          <input className="rounded border p-2" placeholder="difficulty" />
          <input className="rounded border p-2 md:col-span-2" placeholder="explanation" />
          <input className="rounded border p-2 md:col-span-2" placeholder="misconception_notes" />
          <button className="rounded bg-blue-600 p-2 text-white md:col-span-2" type="button">Save Question</button>
        </form>
      </div>
    </section>
  );
}
