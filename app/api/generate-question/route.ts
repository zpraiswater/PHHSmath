import { NextResponse } from "next/server";

export async function POST() {
  // Placeholder for future AI feature.
  // Later this endpoint will call OpenAI and use uploaded example questions
  // to mimic teacher style and generate new multiple-choice algebra questions.
  return NextResponse.json({
    message: "Question generation is not connected yet. This is a scaffold endpoint.",
  });
}
