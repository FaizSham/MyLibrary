-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  borrower_id UUID NOT NULL REFERENCES borrowers(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned')),
  checkout_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_loans_book_id ON loans(book_id);
CREATE INDEX IF NOT EXISTS idx_loans_borrower_id ON loans(borrower_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_due_date ON loans(due_date);

-- Enable Row Level Security
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow SELECT for authenticated users (or service role)
CREATE POLICY "Allow SELECT on loans" ON loans
  FOR SELECT
  USING (true);

-- Allow INSERT for authenticated users (or service role)
CREATE POLICY "Allow INSERT on loans" ON loans
  FOR INSERT
  WITH CHECK (true);

-- Allow UPDATE for authenticated users (or service role)
CREATE POLICY "Allow UPDATE on loans" ON loans
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow DELETE for authenticated users (or service role)
CREATE POLICY "Allow DELETE on loans" ON loans
  FOR DELETE
  USING (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_loans_updated_at
  BEFORE UPDATE ON loans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
