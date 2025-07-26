-- Update yacht_images table to store multiple images per yacht
CREATE TABLE IF NOT EXISTS public.yacht_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  yacht_id UUID NOT NULL,
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

-- Create location_images table
CREATE TABLE IF NOT EXISTS public.location_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.location_images ENABLE ROW LEVEL SECURITY;

-- Create policies for location images
CREATE POLICY "Admin can manage location images" 
ON public.location_images 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can view location images" 
ON public.location_images 
FOR SELECT 
USING (true);

-- Create article_images table
CREATE TABLE IF NOT EXISTS public.article_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.article_images ENABLE ROW LEVEL SECURITY;

-- Create policies for article images
CREATE POLICY "Admin can manage article images" 
ON public.article_images 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can view article images" 
ON public.article_images 
FOR SELECT 
USING (true);

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('location-images', 'location-images', true)
ON CONFLICT (id) DO NOTHING;