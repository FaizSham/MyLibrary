import type { Database } from "@/lib/supabase/types";

type Book = Database["public"]["Tables"]["books"]["Row"];
type Borrower = Database["public"]["Tables"]["borrowers"]["Row"];

// Helper function to transform database book to app book format
export function transformBook(book: Book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn || "",
    genre: book.genre || "",
    publishedYear: book.published_year || 0,
    quantity: book.quantity,
    status: book.status as "available" | "loaned" | "overdue",
    borrowedBy: book.borrowed_by || undefined,
    dueDate: book.due_date || undefined,
    coverUrl: book.cover_url || undefined,
  };
}

// Helper function to transform database borrower to app borrower format
export function transformBorrower(borrower: Borrower) {
  return {
    id: borrower.id,
    name: borrower.name,
    email: borrower.email,
    phone: borrower.phone || "",
    memberId: borrower.member_id,
    joinDate: borrower.join_date,
    activeLoans: borrower.active_loans,
    totalLoans: borrower.total_loans,
    status: borrower.status as "active" | "inactive" | "suspended",
    fineAmount: Number(borrower.fine_amount) || undefined,
  };
}
