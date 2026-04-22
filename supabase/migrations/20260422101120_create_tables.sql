create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  order_id text unique not null,
  amount integer not null,
  status text not null default 'pending',
  snap_token text,
  snap_redirect_url text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists processing_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  transaction_id uuid references transactions(id) on delete set null,
  guideline_filename text,
  thesis_filename text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table transactions enable row level security;
alter table processing_jobs enable row level security;

create policy "Users can view own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can view own jobs"
  on processing_jobs for select
  using (auth.uid() = user_id);