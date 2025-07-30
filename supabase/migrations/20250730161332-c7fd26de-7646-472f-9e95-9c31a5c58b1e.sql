-- Create storage bucket for location images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('location-images', 'location-images', true);

-- Create storage policies for location images
CREATE POLICY "Location images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'location-images');

CREATE POLICY "Authenticated users can upload location images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'location-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update location images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'location-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete location images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'location-images' AND auth.role() = 'authenticated');