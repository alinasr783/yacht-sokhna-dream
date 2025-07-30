-- Drop existing policies for location images
DROP POLICY IF EXISTS "Location images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload location images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update location images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete location images" ON storage.objects;

-- Create new storage policies for location images (allow all operations for now)
CREATE POLICY "Anyone can view location images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'location-images');

CREATE POLICY "Anyone can upload location images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'location-images');

CREATE POLICY "Anyone can update location images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'location-images');

CREATE POLICY "Anyone can delete location images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'location-images');