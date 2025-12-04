-- LearnLynk Tech Test - Task 2: RLS Policies on leads
-- Completed Version

-- Enable RLS on leads table
alter table public.leads enable row level security;

-- Extract JWT fields
-- Example:
-- current_setting('request.jwt.claims', true)::jsonb ->> 'user_id'
-- current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id'
-- current_setting('request.jwt.claims', true)::jsonb ->> 'role'


-------------------------------
-- SELECT POLICY
-------------------------------
create policy "leads_select_policy"
on public.leads
for select
using (

  -- Extract JWT values
  (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id') = tenant_id
  )
  AND
  (
      -- Admins can access all leads in their tenant
      (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'admin'

      OR

      -- Counselors can access leads they own
      (owner_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'user_id')::uuid)

      OR

      -- Counselors can access leads assigned to teams they belong to
      exists (
        select 1
        from public.teams t
        join public.user_teams ut 
          on ut.team_id = t.id
        where 
            t.tenant_id = leads.tenant_id
            and ut.user_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'user_id')::uuid
      )
  )
);


-------------------------------
-- INSERT POLICY
-------------------------------
create policy "leads_insert_policy"
on public.leads
for insert
with check (

  -- Tenant must match user’s tenant
  (current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id') = tenant_id

  AND
  (
    -- Only admins or counselors can insert
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role') IN ('admin', 'counselor')
  )
);
