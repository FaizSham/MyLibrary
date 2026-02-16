-- Auth RLS: Only authenticated users (managers) can access app data.
-- All tables: require auth.uid() IS NOT NULL for SELECT, INSERT, UPDATE, DELETE.

-- 1. books: enable RLS and add policies
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "books_select_authenticated" ON books
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "books_insert_authenticated" ON books
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "books_update_authenticated" ON books
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "books_delete_authenticated" ON books
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- 2. borrowers: enable RLS and add policies
ALTER TABLE borrowers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "borrowers_select_authenticated" ON borrowers
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "borrowers_insert_authenticated" ON borrowers
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "borrowers_update_authenticated" ON borrowers
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "borrowers_delete_authenticated" ON borrowers
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- 3. loans: drop permissive policies and add authenticated-only policies
DROP POLICY IF EXISTS "Allow SELECT on loans" ON loans;
DROP POLICY IF EXISTS "Allow INSERT on loans" ON loans;
DROP POLICY IF EXISTS "Allow UPDATE on loans" ON loans;
DROP POLICY IF EXISTS "Allow DELETE on loans" ON loans;

CREATE POLICY "loans_select_authenticated" ON loans
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "loans_insert_authenticated" ON loans
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "loans_update_authenticated" ON loans
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "loans_delete_authenticated" ON loans
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- 4. book_units: drop permissive policies and add authenticated-only policies
DROP POLICY IF EXISTS "Allow SELECT on book_units" ON book_units;
DROP POLICY IF EXISTS "Allow INSERT on book_units" ON book_units;
DROP POLICY IF EXISTS "Allow UPDATE on book_units" ON book_units;
DROP POLICY IF EXISTS "Allow DELETE on book_units" ON book_units;

CREATE POLICY "book_units_select_authenticated" ON book_units
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "book_units_insert_authenticated" ON book_units
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "book_units_update_authenticated" ON book_units
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "book_units_delete_authenticated" ON book_units
  FOR DELETE
  USING (auth.uid() IS NOT NULL);
