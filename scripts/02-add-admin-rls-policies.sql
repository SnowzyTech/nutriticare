-- Add RLS policies for admin operations on products table
-- Allow authenticated users to insert, update, and delete products (admin operations)
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (true);

-- Add RLS policies for admin operations on blog_posts table
-- Allow authenticated users to insert, update, and delete blog posts (admin operations)
CREATE POLICY "Admins can insert blog posts" ON blog_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update blog posts" ON blog_posts
  FOR UPDATE USING (true);

CREATE POLICY "Admins can delete blog posts" ON blog_posts
  FOR DELETE USING (true);

-- Add RLS policies for admin operations on blog_comments table
-- Allow authenticated users to delete comments (admin operations)
CREATE POLICY "Admins can delete comments" ON blog_comments
  FOR DELETE USING (true);

CREATE POLICY "Users can update their own comments" ON blog_comments
  FOR UPDATE USING (auth.uid() = user_id);
