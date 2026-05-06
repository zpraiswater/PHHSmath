import { MasteryStatus } from "@/lib/types";

const map = {
  "Not Started": "bg-slate-200 text-slate-700",
  Developing: "bg-orange-100 text-orange-700",
  "Almost There": "bg-yellow-100 text-yellow-700",
  Mastered: "bg-green-100 text-green-700"
};

export function Badge({ status }: { status: MasteryStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status]}`}>{status}</span>;
}
