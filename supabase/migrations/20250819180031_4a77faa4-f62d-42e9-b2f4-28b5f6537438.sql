-- Enable RLS on all public tables that have policies but RLS is not enabled

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on articles table  
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on contact_info table
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Enable RLS on locations table
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on yacht_images table
ALTER TABLE public.yacht_images ENABLE ROW LEVEL SECURITY;

-- Enable RLS on yachts table
ALTER TABLE public.yachts ENABLE ROW LEVEL SECURITY;