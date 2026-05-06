export type MasteryStatus = "Not Started" | "Developing" | "Almost There" | "Mastered";

export type Topic = {
  id: string;
  name: string;
  color: string;
  description: string;
};

export function masteryFromStats(attempts: number, pct: number): MasteryStatus {
  if (attempts === 0) return "Not Started";
  if (pct < 60) return "Developing";
  if (pct < 80) return "Almost There";
  return attempts >= 5 ? "Mastered" : "Almost There";
}
