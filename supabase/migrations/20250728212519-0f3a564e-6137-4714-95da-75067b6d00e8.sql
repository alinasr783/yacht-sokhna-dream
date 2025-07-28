-- Add currency and price range fields to yachts table
ALTER TABLE public.yachts 
ADD COLUMN currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'EGP')),
ADD COLUMN price_from NUMERIC,
ADD COLUMN price_to NUMERIC;

-- Update existing yachts to use the new price structure
UPDATE public.yachts 
SET price_from = price, price_to = price, currency = 'USD' 
WHERE price IS NOT NULL;

-- Remove the old price column after migration
-- ALTER TABLE public.yachts DROP COLUMN price;