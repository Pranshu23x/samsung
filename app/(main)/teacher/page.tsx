import { redirect } from "next/navigation";

import { getUserId, isAdmin } from "@/lib/auth";
import { getReadingAttempts, getStudentReadingSummary } from "@/db/queries";

export default async function TeacherPage() {
  const userId = getUserId();
  if (!isAdmin(userId)) {
    redirect("/learn");
  }

  const [attempts, summary] = await Promise.all([
    getReadingAttempts(),
    getStudentReadingSummary(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Teacher Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Attempts</p>
          <p className="text-3xl font-bold">{attempts.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Active Students</p>
          <p className="text-3xl font-bold">{summary.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Needs Attention</p>
          <p className="text-3xl font-bold text-amber-600">
            {summary.filter((s) => s.needsAttention).length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Student Reading Summary</h2>
        </div>

        {summary.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No reading attempts recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 font-medium">Student</th>
                  <th className="px-6 py-3 font-medium">Attempts</th>
                  <th className="px-6 py-3 font-medium">Avg Accuracy</th>
                  <th className="px-6 py-3 font-medium">Avg WCPM</th>
                  <th className="px-6 py-3 font-medium">Last Attempt</th>
                  <th className="px-6 py-3 font-medium">Most Missed</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((student) => (
                  <tr
                    key={student.userId}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-6 py-4 font-mono text-xs">
                      {student.userId.slice(0, 12)}...
                    </td>
                    <td className="px-6 py-4">{student.totalAttempts}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full rounded-full ${
                              student.avgAccuracy >= 80
                                ? "bg-green-500"
                                : student.avgAccuracy >= 60
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${student.avgAccuracy}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {student.avgAccuracy}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{student.avgWcpm} wpm</td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          student.lastAccuracy >= 80
                            ? "text-green-600"
                            : student.lastAccuracy >= 60
                              ? "text-amber-600"
                              : "text-red-600"
                        }
                      >
                        {student.lastAccuracy}%
                      </span>
                      {" / "}
                      {student.lastWcpm} wpm
                    </td>
                    <td className="max-w-[200px] truncate px-6 py-4">
                      {student.mostMissed.length > 0
                        ? student.mostMissed.join(", ")
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {student.needsAttention ? (
                        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                          Needs attention
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          On track
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Recent Attempts</h2>
        </div>
        {attempts.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No attempts yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Lesson</th>
                  <th className="px-6 py-3 font-medium">Accuracy</th>
                  <th className="px-6 py-3 font-medium">WCPM</th>
                  <th className="px-6 py-3 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 50).map((a) => (
                  <tr
                    key={a.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="whitespace-nowrap px-6 py-3 text-xs text-muted-foreground">
                      {new Date(a.createdAt).toLocaleDateString()}{" "}
                      {new Date(a.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="max-w-[100px] truncate px-6 py-3 font-mono text-xs">
                      {a.userId.slice(0, 12)}...
                    </td>
                    <td className="px-6 py-3">
                      {a.lesson?.title ?? `Lesson ${a.lessonId}`}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={
                          a.accuracy >= 80
                            ? "text-green-600"
                            : a.accuracy >= 60
                              ? "text-amber-600"
                              : "text-red-600"
                        }
                      >
                        {a.accuracy}%
                      </span>
                    </td>
                    <td className="px-6 py-3">{a.wcpm}</td>
                    <td className="px-6 py-3">
                      {Math.round(a.durationMs / 1000)}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
