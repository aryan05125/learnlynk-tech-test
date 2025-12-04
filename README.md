🚀 LearnLynk – Technical Assessment
Backend · RLS · Edge Functions · Next.js · Supabase · Stripe
🧩 Overview

This repository contains my complete solution for the LearnLynk Technical Assessment, covering:

🗄️ PostgreSQL + Supabase Schema Design

🔐 Row-Level Security (RLS) Policies

⚡ Supabase Edge Function (create-task)

💻 Next.js Page – Tasks Due Today

💳 Stripe Checkout Flow (Written Explanation)

Every task has been implemented carefully with clear structure, clean code, and production-friendly logic.

📁 Project Structure
/backend
   schema.sql
   rls_policies.sql
   /edge-functions
       /create-task
           index.ts

/frontend
   /pages
       /dashboard
           today.tsx

README.md

🧱 Task 1 — Database Schema (PostgreSQL + Supabase)

✔ Created leads, applications, tasks tables
✔ Added UUID PKs, timestamps, tenant_id
✔ Implemented foreign keys
✔ Added check constraints (task types, due date validation)
✔ Added indexes for performance

All SQL is inside backend/schema.sql.

🔐 Task 2 — Row Level Security Policies

Implemented secure and correct RLS rules based on:

👨‍🏫 Counselor → can access:

leads they own

leads belonging to their teams

👨‍💼 Admin → can access all leads in their tenant

➕ INSERT allowed only inside their own tenant

All policies are inside backend/rls_policies.sql.

⚡ Task 3 — Edge Function: create-task

A fully implemented POST endpoint that:

📝 Validates input

⏳ Ensures due_at is a future timestamp

✔ Accepts only: call, email, review

🗃️ Inserts into tasks using Service Role Key

🔁 Returns: { success: true, task_id }

🧯 Proper 400 / 500 error responses

File:
backend/edge-functions/create-task/index.ts

💻 Task 4 — Next.js Page: Tasks Due Today

A clean and simple UI that:

🔍 Fetches tasks due today

❌ Excludes completed tasks

🔄 Allows “Mark Complete” updates

📅 Uses correct date filtering (00:00 → 23:59)

🎨 Minimal, readable UI

File:
frontend/pages/dashboard/today.tsx

💳 Task 5 — Stripe Answer
✨ Stripe Checkout Flow – Implementation Outline

To implement Stripe Checkout for application fees, I would:

Insert a row into payment_requests with:

tenant_id

application_id

amount

status = "pending"

Call Stripe Checkout Session API

Store session_id + payment_intent in the database

Redirect user to the hosted checkout page

Handle the checkout.session.completed webhook

Verify signature for security

Update payment_requests.status = 'paid'

Update the related application stage to “Payment Received”

Log the timeline event for auditing

This ensures reliable payment even if frontend fails or the user disconnects.

🛠️ Tech Used

🟦 Supabase Postgres

⚡ Supabase Edge Functions (Deno + TypeScript)

⚛️ Next.js + TypeScript

🧪 RLS Policies

💳 Stripe (conceptual flow)

📬 Submission Notes

This repository is the complete implementation of the LearnLynk technical test.
Comments, assumptions, and decisions are clearly documented in the code.

🎉 Thank You!

If you have any questions or need further clarification, feel free to reach out.
I'm excited about the possibility of contributing to LearnLynk.
