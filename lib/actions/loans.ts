"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/types";
import { transformLoan } from "@/lib/utils/transform";

type Loan = Database["public"]["Tables"]["loans"]["Row"];
type LoanInsert = Database["public"]["Tables"]["loans"]["Insert"];
type LoanUpdate = Database["public"]["Tables"]["loans"]["Update"];
type Book = Database["public"]["Tables"]["books"]["Row"];
type Borrower = Database["public"]["Tables"]["borrowers"]["Row"];

export async function getLoans(filters?: {
  status?: "active" | "returned" | "overdue";
  search?: string;
}) {
  try {
    const supabase = createAdminClient();
    
    // Fetch loans with book and borrower data
    let query = supabase
      .from("loans")
      .select(`
        *,
        books (*),
        borrowers (*)
      `)
      .order("checkout_date", { ascending: false });

    if (filters?.status && filters.status !== "overdue") {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching loans:", error);
      throw error;
    }

    // Transform loans and apply filters
    const loans = (data || []).map((loan: any) => {
      const book = loan.books as Book;
      const borrower = loan.borrowers as Borrower;
      return transformLoan(loan as Loan, book, borrower);
    });

    // Apply search filter
    let filteredLoans = loans;
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredLoans = loans.filter(
        (loan) =>
          loan.bookTitle.toLowerCase().includes(searchLower) ||
          loan.bookAuthor.toLowerCase().includes(searchLower) ||
          loan.borrowerName.toLowerCase().includes(searchLower) ||
          loan.borrowerMemberId.toLowerCase().includes(searchLower)
      );
    }

    // Apply overdue filter (must be active and past due date)
    if (filters?.status === "overdue") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filteredLoans = filteredLoans.filter(
        (loan) =>
          loan.status === "overdue" ||
          (loan.status === "active" && new Date(loan.dueDate) < today)
      );
    }

    return { data: filteredLoans, error: null };
  } catch (error) {
    console.error("Error in getLoans:", error);
    return { data: [], error: error as Error };
  }
}

export async function getLoanById(id: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("loans")
      .select(`
        *,
        books (*),
        borrowers (*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching loan:", error);
      throw error;
    }

    const book = (data as any).books as Book;
    const borrower = (data as any).borrowers as Borrower;
    const loan = transformLoan(data as Loan, book, borrower);

    return { data: loan, error: null };
  } catch (error) {
    console.error("Error in getLoanById:", error);
    return { data: null, error: error as Error };
  }
}

export async function createLoan(
  bookId: string,
  borrowerId: string,
  dueDate?: string
) {
  try {
    const supabase = createAdminClient();

    // Validate book exists and is available
    const { data: book, error: bookError } = await supabase
      .from("books")
      .select("*")
      .eq("id", bookId)
      .single();

    if (bookError || !book) {
      throw new Error("Book not found");
    }

    if (book.status !== "available") {
      throw new Error("Book is not available for checkout");
    }

    // Validate borrower exists and is active
    const { data: borrower, error: borrowerError } = await supabase
      .from("borrowers")
      .select("*")
      .eq("id", borrowerId)
      .single();

    if (borrowerError || !borrower) {
      throw new Error("Borrower not found");
    }

    if (borrower.status !== "active") {
      throw new Error("Borrower is not active and cannot checkout books");
    }

    // Calculate due date (default: 14 days from today)
    const checkoutDate = new Date().toISOString().split("T")[0];
    const finalDueDate =
      dueDate ||
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    // Create loan
    const { data: loan, error: loanError } = await supabase
      .from("loans")
      .insert({
        book_id: bookId,
        borrower_id: borrowerId,
        checkout_date: checkoutDate,
        due_date: finalDueDate,
        status: "active",
      })
      .select()
      .single();

    if (loanError) {
      console.error("Error creating loan:", loanError);
      throw loanError;
    }

    // Update book status
    const { error: bookUpdateError } = await supabase
      .from("books")
      .update({
        status: "loaned",
        borrowed_by: borrower.name,
        due_date: finalDueDate,
      })
      .eq("id", bookId);

    if (bookUpdateError) {
      console.error("Error updating book:", bookUpdateError);
      // Try to rollback loan creation
      await supabase.from("loans").delete().eq("id", loan.id);
      throw bookUpdateError;
    }

    // Update borrower loan counts
    const { error: borrowerUpdateError } = await supabase
      .from("borrowers")
      .update({
        active_loans: borrower.active_loans + 1,
        total_loans: borrower.total_loans + 1,
      })
      .eq("id", borrowerId);

    if (borrowerUpdateError) {
      console.error("Error updating borrower:", borrowerUpdateError);
      // Try to rollback
      await supabase.from("loans").delete().eq("id", loan.id);
      await supabase
        .from("books")
        .update({
          status: "available",
          borrowed_by: null,
          due_date: null,
        })
        .eq("id", bookId);
      throw borrowerUpdateError;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/loans");
    revalidatePath("/dashboard/books");
    revalidatePath("/dashboard/borrowers");

    return { data: loan, error: null };
  } catch (error) {
    console.error("Error in createLoan:", error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Failed to create loan"),
    };
  }
}

export async function returnLoan(id: string) {
  try {
    const supabase = createAdminClient();

    // Get loan with book and borrower info
    const { data: loan, error: loanError } = await supabase
      .from("loans")
      .select(`
        *,
        books (*),
        borrowers (*)
      `)
      .eq("id", id)
      .single();

    if (loanError || !loan) {
      throw new Error("Loan not found");
    }

    const book = (loan as any).books as Book;
    const borrower = (loan as any).borrowers as Borrower;

    if ((loan as Loan).status === "returned") {
      throw new Error("Loan has already been returned");
    }

    const returnDate = new Date().toISOString().split("T")[0];

    // Update loan
    const { error: updateLoanError } = await supabase
      .from("loans")
      .update({
        return_date: returnDate,
        status: "returned",
      })
      .eq("id", id);

    if (updateLoanError) {
      console.error("Error updating loan:", updateLoanError);
      throw updateLoanError;
    }

    // Update book status
    const { error: bookUpdateError } = await supabase
      .from("books")
      .update({
        status: "available",
        borrowed_by: null,
        due_date: null,
      })
      .eq("id", book.id);

    if (bookUpdateError) {
      console.error("Error updating book:", bookUpdateError);
      // Try to rollback loan update
      await supabase
        .from("loans")
        .update({
          return_date: null,
          status: "active",
        })
        .eq("id", id);
      throw bookUpdateError;
    }

    // Update borrower active loans count
    const { error: borrowerUpdateError } = await supabase
      .from("borrowers")
      .update({
        active_loans: Math.max(0, borrower.active_loans - 1),
      })
      .eq("id", borrower.id);

    if (borrowerUpdateError) {
      console.error("Error updating borrower:", borrowerUpdateError);
      // Try to rollback
      await supabase
        .from("loans")
        .update({
          return_date: null,
          status: "active",
        })
        .eq("id", id);
      await supabase
        .from("books")
        .update({
          status: "loaned",
          borrowed_by: borrower.name,
          due_date: (loan as Loan).due_date,
        })
        .eq("id", book.id);
      throw borrowerUpdateError;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/loans");
    revalidatePath("/dashboard/books");
    revalidatePath("/dashboard/borrowers");

    return { error: null };
  } catch (error) {
    console.error("Error in returnLoan:", error);
    return {
      error: error instanceof Error ? error : new Error("Failed to return loan"),
    };
  }
}
