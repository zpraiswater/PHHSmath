import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "College Algebra Final Review Dashboard",
  description: "Track practice and mastery by topic",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <Link href="/" className="text-lg font-semibold">Algebra Review</Link>
            <div className="flex gap-3 text-sm">
              <Link href="/dashboard">Student</Link>
              <Link href="/progress">Progress</Link>
              <Link href="/admin">Teacher</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
