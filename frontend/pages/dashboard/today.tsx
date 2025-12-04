import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

type Task = {
  id: string;
  type: string;
  status: string;
  application_id: string;
  due_at: string;
};

export default function TodayDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper: Get today's date range (00:00 → 23:59)
  function getTodayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  async function fetchTasks() {
    setLoading(true);
    setError(null);

    try {
      const { start, end } = getTodayRange();

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .neq("status", "completed")
        .gte("due_at", start.toISOString())
        .lte("due_at", end.toISOString());

      if (error) {
        console.error(error);
        throw new Error("Error fetching tasks");
      }

      setTasks(data || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function markComplete(id: string) {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: "completed" })
        .eq("id", id);

      if (error) {
        console.error(error);
        throw new Error("Failed to update task");
      }

      // Refresh list
      fetchTasks();
    } catch (err: any) {
      console.error(err);
      alert("Failed to update task");
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <div style={{ padding: "1rem" }}>Loading tasks...</div>;
  if (error) return <div style={{ color: "red", padding: "1rem" }}>{error}</div>;

  return (
    <main style={{ padding: "1.5rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Today&apos;s Tasks</h1>

      {tasks.length === 0 && <p>No tasks due today 🎉</p>}

      {tasks.length > 0 && (
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc" }}>
              <th style={{ padding: "8px" }}>Type</th>
              <th style={{ padding: "8px" }}>Application</th>
              <th style={{ padding: "8px" }}>Due At</th>
              <th style={{ padding: "8px" }}>Status</th>
              <th style={{ padding: "8px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>{t.type}</td>
                <td style={{ padding: "8px" }}>{t.application_id}</td>
                <td style={{ padding: "8px" }}>
                  {new Date(t.due_at).toLocaleString()}
                </td>
                <td style={{ padding: "8px" }}>{t.status}</td>
                <td style={{ padding: "8px" }}>
                  {t.status !== "completed" && (
                    <button
                      onClick={() => markComplete(t.id)}
                      style={{
                        background: "#22c55e",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Mark Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
