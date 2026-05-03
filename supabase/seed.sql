-- After creating the admin user via the Supabase dashboard or Auth API
-- (e.g. admin@gmail.com), run this to elevate them to the admin role:
update public.profiles set role = 'admin' where email = 'admin@gmail.com';
