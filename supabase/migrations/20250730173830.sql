-- إضافة جدول معلومات التواصل
CREATE TABLE public.contact_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  phone text,
  whatsapp text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- إضافة حقل show_on_homepage للجداول الموجودة
ALTER TABLE public.yachts ADD COLUMN show_on_homepage boolean DEFAULT true;
ALTER TABLE public.articles ADD COLUMN show_on_homepage boolean DEFAULT true;
ALTER TABLE public.locations ADD COLUMN show_on_homepage boolean DEFAULT true;

-- تفعيل RLS على جدول معلومات التواصل
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- سياسات RLS لمعلومات التواصل
CREATE POLICY "Everyone can view contact info" 
ON public.contact_info 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage contact info" 
ON public.contact_info 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- إدراج معلومات التواصل الافتراضية
INSERT INTO public.contact_info (email, phone, whatsapp) 
VALUES ('info@yachtcharter.com', '+1234567890', '+1234567890');

-- إنشاء trigger لتحديث updated_at
CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON public.contact_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- تحديث سياسات التخزين للصور لتكون عامة
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('yacht-images', 'article-images', 'location-images');

-- حذف السياسات الموجودة وإنشاء سياسات جديدة مبسطة
DROP POLICY IF EXISTS "Allow public read access on yacht-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin upload on yacht-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete on yacht-images" ON storage.objects;

DROP POLICY IF EXISTS "Allow public read access on article-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin upload on article-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete on article-images" ON storage.objects;

DROP POLICY IF EXISTS "Allow public read access on location-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin upload on location-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete on location-images" ON storage.objects;

-- سياسات عامة للوصول للصور
CREATE POLICY "Public can view all images" ON storage.objects
FOR SELECT USING (bucket_id IN ('yacht-images', 'article-images', 'location-images'));

CREATE POLICY "Admins can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('yacht-images', 'article-images', 'location-images'));

CREATE POLICY "Admins can update images" ON storage.objects
FOR UPDATE USING (bucket_id IN ('yacht-images', 'article-images', 'location-images'));

CREATE POLICY "Admins can delete images" ON storage.objects
FOR DELETE USING (bucket_id IN ('yacht-images', 'article-images', 'location-images'));