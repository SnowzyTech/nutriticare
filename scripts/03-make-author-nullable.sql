-- Make author_id nullable to allow seeding blog posts without authors
ALTER TABLE blog_posts ALTER COLUMN author_id DROP NOT NULL;
