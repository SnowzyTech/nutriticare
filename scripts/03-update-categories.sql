-- Update product categories to match the desired category list
-- This script updates existing categories and standardizes the naming

-- Update "vitamins and minerals" to "Detox & Cleanse"
UPDATE products 
SET category = 'Detox & Cleanse' 
WHERE LOWER(category) LIKE '%vitamin%' OR LOWER(category) LIKE '%mineral%';

-- Standardize "Women's Wellness" (in case there are variations)
UPDATE products 
SET category = 'Women''s Wellness' 
WHERE LOWER(category) LIKE '%women%';

-- Standardize "Men's Health" (in case there are variations)
UPDATE products 
SET category = 'Men''s Health' 
WHERE LOWER(category) LIKE '%men%';

-- Update any "weight" related categories to "Weight Management"
UPDATE products 
SET category = 'Weight Management' 
WHERE LOWER(category) LIKE '%weight%';

-- Display the updated categories
SELECT DISTINCT category, COUNT(*) as product_count
FROM products
GROUP BY category
ORDER BY category;
