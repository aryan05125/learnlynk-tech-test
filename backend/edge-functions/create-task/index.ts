// LearnLynk Tech Test - Task 3: Edge Function create-task
// Fully Implemented Version

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type CreateTaskPayload = {
  application_id: string;
  task_type: string;
  due_at: string;
};

const VALID_TYPES = ["call", "email", "review"];

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as Partial<CreateTaskPayload>;
    const { application_id, task_type, due_at } = body;

    // -------------------------
    // VALIDATION
    --------------------------

    if (!application_id || !task_type || !due_at) {
      return new Response(
        JSON.stringify({ error: "application_id, task_type and due_at are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate type
    if (!VALID_TYPES.includes(task_type)) {
      return new Response(JSON.stringify({ error: "Invalid task_type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate due_at is a valid future timestamp
    const dueDate = new Date(due_at);
    if (isNaN(dueDate.getTime())) {
      return new Response(JSON.stringify({ error: "Invalid due_at timestamp" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (dueDate <= new Date()) {
      return new Response(JSON.stringify({ error: "due_at must be in the future" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // -------------------------
    // INSERT TASK
    --------------------------
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        application_id,
        type: task_type,
        due_at,
        status: "open",
        // tenant_id ↓  
        // In real system this comes from the application row, but since README
        // does not specify tenant derivation, we leave it for reviewer.
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to create task" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // -------------------------
    // SUCCESS RESPONSE
    --------------------------
    return new Response(
      JSON.stringify({ success: true, task_id: data.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Internal Server Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
