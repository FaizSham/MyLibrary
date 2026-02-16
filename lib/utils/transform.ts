import type { Database } from "@/lib/supabase/types";
import type { BookWithCounts } from "@/lib/actions/books";

type Book = Database["public"]["Tables"]["books"]["Row"];
type Borrower = Database["public"]["Tables"]["borrowers"]["Row"];
type Loan = Database["public"]["Tables"]["loans"]["Row"];

// Helper function to transform database book (with unit counts) to app book format
export function transformBook(book: BookWithCounts) {
  const availableCount = book.availableCount ?? 0;
  const loanedCount = book.loanedCount ?? 0;
  const totalCount = book.totalCount ?? 0;

  const status: "available" | "loaned" | "overdue" =
    availableCount > 0 ? "available" : loanedCount > 0 ? "loaned" : "available";

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn || "",
    genre: book.genre || "",
    publishedYear: book.published_year || 0,
    quantity: totalCount,
    availableCount,
    loanedCount,
    totalCount,
    status,
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
    activeLoans: borrower.active_loans ?? 0,
    totalLoans: borrower.total_loans ?? 0,
    status: borrower.status as "active" | "inactive" | "suspended",
    fineAmount: borrower.fine_amount != null ? Number(borrower.fine_amount) : undefined,
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

  let status: "active" | "returned" | "overdue" = loan.status as "active" | "returned";
  if (loan.status === "active" && dueDate < today) {
    status = "overdue";
  }

  return {
    id: loan.id,
    bookId: book?.id || "",
    bookUnitId: loan.book_unit_id,
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
