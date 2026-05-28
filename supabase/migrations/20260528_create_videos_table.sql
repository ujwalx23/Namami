-- Create videos table for storing YouTube videos and shorts
create table public.videos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  embed text not null,
  type text not null check (type in ('video', 'short')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable row level security
alter table public.videos enable row level security;

-- Create policy to allow public read access
create policy "Enable read access for all users"
  on public.videos for select
  using (true);

-- Create policy to allow authenticated users to insert
create policy "Enable insert for authenticated users"
  on public.videos for insert
  with check (auth.role() = 'authenticated');

-- Create policy to allow service role to manage videos
create policy "Enable all operations for service role"
  on public.videos for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
