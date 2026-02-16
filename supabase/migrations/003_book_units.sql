-- Book Units Migration: Separate catalog (books) from physical copies (book_units)
-- Loans will reference book_unit_id instead of book_id

-- 1. Create book_units table
CREATE TABLE IF NOT EXISTS book_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'loaned', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_book_units_book_id ON book_units(book_id);
CREATE INDEX IF NOT EXISTS idx_book_units_status ON book_units(status);

ALTER TABLE book_units ENABLE ROW LEVEL SECURITY;

-- RLS policies for book_units (mirror existing pattern)
CREATE POLICY "Allow SELECT on book_units" ON book_units
  FOR SELECT
  USING (true);

CREATE POLICY "Allow INSERT on book_units" ON book_units
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow UPDATE on book_units" ON book_units
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow DELETE on book_units" ON book_units
  FOR DELETE
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_book_units_updated_at
  BEFORE UPDATE ON book_units
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 2. Populate book_units from books (one unit per quantity, status derived)
DO $$
DECLARE
  r RECORD;
  i INT;
  qty INT;
  loaned_cnt INT;
BEGIN
  FOR r IN SELECT id, GREATEST(COALESCE(quantity, 1), 1) AS qty FROM books
  LOOP
    SELECT COUNT(*) INTO loaned_cnt FROM loans WHERE book_id = r.id AND status = 'active';
    qty := r.qty;
    FOR i IN 1..qty LOOP
      INSERT INTO book_units (book_id, status) VALUES (
        r.id,
        CASE WHEN i <= loaned_cnt THEN 'loaned' ELSE 'available' END
      );
    END LOOP;
  END LOOP;
END $$;

-- 3. Add book_unit_id to loans (nullable for migration)
ALTER TABLE loans ADD COLUMN book_unit_id UUID REFERENCES book_units(id) ON DELETE RESTRICT;

-- 4. Backfill loans: assign each loan to a book_unit
-- For active loans: assign the loaned unit (at most 1 active loan per book in current design)
UPDATE loans l SET book_unit_id = (
  SELECT bu.id FROM book_units bu
  WHERE bu.book_id = l.book_id AND bu.status = 'loaned'
  ORDER BY bu.id
  LIMIT 1
) WHERE l.status = 'active' AND l.book_unit_id IS NULL;

-- For returned loans: assign any unit of that book
UPDATE loans l SET book_unit_id = (
  SELECT bu.id FROM book_units bu
  WHERE bu.book_id = l.book_id
  ORDER BY bu.id
  LIMIT 1
) WHERE l.book_unit_id IS NULL;

-- 5. Drop book_id FK and column, make book_unit_id NOT NULL
ALTER TABLE loans DROP CONSTRAINT IF EXISTS loans_book_id_fkey;
ALTER TABLE loans DROP COLUMN book_id;
ALTER TABLE loans ALTER COLUMN book_unit_id SET NOT NULL;

-- Recreate index for book_unit_id
CREATE INDEX IF NOT EXISTS idx_loans_book_unit_id ON loans(book_unit_id);
DROP INDEX IF EXISTS idx_loans_book_id;

-- 6. Remove status, borrowed_by, due_date, quantity from books
ALTER TABLE books DROP COLUMN IF EXISTS status;
ALTER TABLE books DROP COLUMN IF EXISTS borrowed_by;
ALTER TABLE books DROP COLUMN IF EXISTS due_date;
ALTER TABLE books DROP COLUMN IF EXISTS quantity;

-- Drop obsolete index
DROP INDEX IF EXISTS idx_books_status;
