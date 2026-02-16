import type { Database } from "@/lib/supabase/types";

type Book = Database["public"]["Tables"]["books"]["Row"];
type Borrower = Database["public"]["Tables"]["borrowers"]["Row"];
type Loan = Database["public"]["Tables"]["loans"]["Row"];

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

// Helper function to transform database loan to app loan format
export function transformLoan(
  loan: Loan,
  book?: Book,
  borrower?: Borrower
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(loan.due_date);
  dueDate.setHours(0, 0, 0, 0);
  
  // Determine if loan is overdue (active loan past due date)
  let status: "active" | "returned" | "overdue" = loan.status as "active" | "returned";
  if (loan.status === "active" && dueDate < today) {
    status = "overdue";
  }

  return {
    id: loan.id,
    bookId: loan.book_id,
    borrowerId: loan.borrower_id,
    bookTitle: book?.title || "",
    bookAuthor: book?.author || "",
    borrowerName: borrower?.name || "",
    borrowerMemberId: borrower?.member_id || "",
    checkoutDate: loan.checkout_date,
    dueDate: loan.due_date,
    returnDate: loan.return_date || undefined,
    status,
  };
}
