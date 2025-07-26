-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create locations table
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  google_maps_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Create policies for locations
CREATE POLICY "Admin can manage locations" 
ON public.locations 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can view locations" 
ON public.locations 
FOR SELECT 
USING (true);

-- Create yachts table
CREATE TABLE public.yachts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  features_en TEXT,
  features_ar TEXT,
  price DECIMAL,
  location_id UUID REFERENCES public.locations(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.yachts ENABLE ROW LEVEL SECURITY;

-- Create policies for yachts
CREATE POLICY "Admin can manage yachts" 
ON public.yachts 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can view yachts" 
ON public.yachts 
FOR SELECT 
USING (true);

-- Create yacht images table
CREATE TABLE public.yacht_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  yacht_id UUID NOT NULL REFERENCES public.yachts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.yacht_images ENABLE ROW LEVEL SECURITY;

-- Create policies for yacht images
CREATE POLICY "Admin can manage yacht images" 
ON public.yacht_images 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can view yacht images" 
ON public.yacht_images 
FOR SELECT 
USING (true);

-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policies for articles
CREATE POLICY "Admin can manage articles" 
ON public.articles 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can view articles" 
ON public.articles 
FOR SELECT 
USING (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('yacht-images', 'yacht-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true);

-- Create storage policies for yacht images
CREATE POLICY "Public can view yacht images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'yacht-images');

CREATE POLICY "Admin can upload yacht images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'yacht-images');

CREATE POLICY "Admin can update yacht images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'yacht-images');

CREATE POLICY "Admin can delete yacht images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'yacht-images');

-- Create storage policies for article images
CREATE POLICY "Public can view article images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'article-images');

CREATE POLICY "Admin can upload article images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Admin can update article images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'article-images');

CREATE POLICY "Admin can delete article images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'article-images');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON public.locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_yachts_updated_at
BEFORE UPDATE ON public.yachts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the admin user
INSERT INTO public.admin_users (email, password) 
VALUES ('alinasreldin783@gmail.com', 'Alinasr89#');