"use client";
import { useState } from "react";

const questions = [
  { id: 1, text: "Solve: 2x + 5 = 17", choices: ["x=6", "x=5", "x=11", "x=4"], correct: "x=6", explanation: "Subtract 5, then divide by 2." },
  { id: 2, text: "Factor: x² + 5x + 6", choices: ["(x+1)(x+6)", "(x+2)(x+3)", "(x-2)(x-3)", "Prime"], correct: "(x+2)(x+3)", explanation: "Need two numbers multiplying to 6 and summing to 5." }
];

export default function TopicPracticePage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  async function submitAttempt() {
    setSubmitted(true);
    // Later: insert into attempts table and recalculate mastery per topic.
    // This client structure is ready for DB wiring once auth/session is enforced.
  }

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Topic Practice (5 Questions)</h1>
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="card">
            <p className="mb-3 font-medium">{idx + 1}. {q.text}</p>
            <div className="grid gap-2">
              {q.choices.map((c) => (
                <label key={c} className="rounded-lg border p-2">
                  <input type="radio" name={`q-${q.id}`} className="mr-2" onChange={() => setAnswers((p) => ({ ...p, [q.id]: c }))} />
                  {c}
                </label>
              ))}
            </div>
            {submitted && (
              <p className="mt-2 text-sm">
                {answers[q.id] === q.correct ? "✅ Correct" : `❌ Incorrect. ${q.explanation}`}
              </p>
            )}
          </div>
        ))}
      </div>
      <button onClick={submitAttempt} className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-white">Submit Attempt</button>
    </section>
  );
}
