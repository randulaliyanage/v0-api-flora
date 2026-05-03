-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  phone text,
  email text not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- Flowers table
create table public.flowers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  image_url text,
  price_lkr integer not null,
  stock_count integer not null default 0,
  category text not null check (category in ('flower','confection','gift','balloon')),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Orders table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.profiles(id),
  status text not null default 'placed' check (status in ('placed','arranging','out_for_delivery','delivered')),
  flowers jsonb not null default '[]',
  total_lkr integer not null,
  delivery_type text not null check (delivery_type in ('pickup','delivery')),
  delivery_address text,
  delivery_fee_lkr integer default 0,
  scheduled_date date,
  reference_image_url text,
  created_at timestamptz default now()
);

-- Daily capacity table
create table public.daily_capacity (
  date date primary key,
  max_orders integer not null default 20,
  current_orders integer not null default 0
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.flowers enable row level security;
alter table public.orders enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins have full profile access" on public.profiles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Anyone can read active flowers" on public.flowers for select using (is_active = true);
create policy "Admins can manage flowers" on public.flowers for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Customers can read own orders" on public.orders for select using (customer_id = auth.uid());
create policy "Customers can insert orders" on public.orders for insert with check (customer_id = auth.uid());
create policy "Admins can manage all orders" on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
