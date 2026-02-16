"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/types";
import { transformLoan } from "@/lib/utils/transform";
import { getAvailableUnitsForBook } from "@/lib/actions/books";

type Loan = Database["public"]["Tables"]["loans"]["Row"];
type Book = Database["public"]["Tables"]["books"]["Row"];
type Borrower = Database["public"]["Tables"]["borrowers"]["Row"];
type BookUnit = Database["public"]["Tables"]["book_units"]["Row"];

export async function getLoans(filters?: {
  status?: "active" | "returned" | "overdue";
  search?: string;
}) {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("loans")
      .select(`
        *,
        book_units (
          id,
          status,
          books (*)
        ),
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

    const loans = (data || []).map((row: any) => {
      const unit = row.book_units as BookUnit & { books: Book };
      const book = unit?.books as Book;
      const borrower = row.borrowers as Borrower;
      return transformLoan(row as Loan, book, borrower);
    });

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
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("loans")
      .select(`
        *,
        book_units (
          id,
          status,
          books (*)
        ),
        borrowers (*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching loan:", error);
      throw error;
    }

    const row = data as any;
    const unit = row.book_units as BookUnit & { books: Book };
    const book = unit?.books as Book;
    const borrower = row.borrowers as Borrower;
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
    const supabase = await createClient();

    const { data: availableUnits, error: unitsError } =
      await getAvailableUnitsForBook(bookId);

    if (unitsError || !availableUnits || availableUnits.length === 0) {
      throw new Error("No available copies of this book");
    }

    const unit = availableUnits[0];

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

    const checkoutDate = new Date().toISOString().split("T")[0];
    const finalDueDate =
      dueDate ||
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    const { data: loan, error: loanError } = await supabase
      .from("loans")
      .insert({
        book_unit_id: unit.id,
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

    const { error: unitUpdateError } = await supabase
      .from("book_units")
      .update({ status: "loaned" })
      .eq("id", unit.id);

    if (unitUpdateError) {
      console.error("Error updating unit status:", unitUpdateError);
      await supabase.from("loans").delete().eq("id", loan.id);
      throw unitUpdateError;
    }

    const { error: borrowerUpdateError } = await supabase
      .from("borrowers")
      .update({
        active_loans: (borrower.active_loans ?? 0) + 1,
        total_loans: (borrower.total_loans ?? 0) + 1,
      })
      .eq("id", borrowerId);

    if (borrowerUpdateError) {
      console.error("Error updating borrower:", borrowerUpdateError);
      await supabase.from("loans").delete().eq("id", loan.id);
      await supabase
        .from("book_units")
        .update({ status: "available" })
        .eq("id", unit.id);
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
    const supabase = await createClient();

    const { data: loan, error: loanError } = await supabase
      .from("loans")
      .select(`
        *,
        book_units (
          id,
          status,
          books (*)
        ),
        borrowers (*)
      `)
      .eq("id", id)
      .single();

    if (loanError || !loan) {
      throw new Error("Loan not found");
    }

    const row = loan as any;
    const unit = row.book_units as BookUnit;
    const borrower = row.borrowers as Borrower;

    if ((loan as Loan).status === "returned") {
      throw new Error("Loan has already been returned");
    }

    const returnDate = new Date().toISOString().split("T")[0];

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

    const { error: unitUpdateError } = await supabase
      .from("book_units")
      .update({ status: "available" })
      .eq("id", unit.id);

    if (unitUpdateError) {
      console.error("Error updating unit status:", unitUpdateError);
      await supabase
        .from("loans")
        .update({
          return_date: null,
          status: "active",
        })
        .eq("id", id);
      throw unitUpdateError;
    }

    const { error: borrowerUpdateError } = await supabase
      .from("borrowers")
      .update({
        active_loans: Math.max(0, (borrower.active_loans ?? 0) - 1),
      })
      .eq("id", borrower.id);

    if (borrowerUpdateError) {
      console.error("Error updating borrower:", borrowerUpdateError);
      await supabase
        .from("loans")
        .update({
          return_date: null,
          status: "active",
        })
        .eq("id", id);
      await supabase
        .from("book_units")
        .update({ status: "loaned" })
        .eq("id", unit.id);
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
