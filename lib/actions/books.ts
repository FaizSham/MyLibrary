"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/types";

type Book = Database["public"]["Tables"]["books"]["Row"];
type BookInsert = Database["public"]["Tables"]["books"]["Insert"];
type BookUpdate = Database["public"]["Tables"]["books"]["Update"];
type BookUnit = Database["public"]["Tables"]["book_units"]["Row"];

export type BookWithUnits = Book & {
  book_units: BookUnit[];
};

export type BookWithCounts = Book & {
  availableCount: number;
  loanedCount: number;
  totalCount: number;
};

export async function getBooks(filters?: {
  status?: "available" | "loaned" | "overdue";
  search?: string;
}) {
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("books")
      .select(`
        *,
        book_units (id, status)
      `)
      .order("created_at", { ascending: false });

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,author.ilike.%${filters.search}%,isbn.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching books:", error);
      throw error;
    }

    const books = (data || []) as BookWithUnits[];
    const withCounts: BookWithCounts[] = books.map((b) => {
      const units = b.book_units || [];
      const availableCount = units.filter((u) => u.status === "available").length;
      const loanedCount = units.filter((u) => u.status === "loaned").length;
      const totalCount = units.length;
      const { book_units: _, ...bookData } = b;
      return { ...bookData, availableCount, loanedCount, totalCount };
    });

    let filtered = withCounts;
    if (filters?.status === "available") {
      filtered = withCounts.filter((b) => b.availableCount > 0);
    } else if (filters?.status === "loaned") {
      filtered = withCounts.filter((b) => b.loanedCount > 0);
    } else if (filters?.status === "overdue") {
      filtered = withCounts.filter((b) => b.loanedCount > 0);
    }

    return { data: filtered, error: null };
  } catch (error) {
    console.error("Error in getBooks:", error);
    return { data: [], error: error as Error };
  }
}

export async function getBookById(id: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("books")
      .select(`
        *,
        book_units (id, status)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching book:", error);
      throw error;
    }

    const book = data as BookWithUnits;
    const units = book.book_units || [];
    const availableCount = units.filter((u) => u.status === "available").length;
    const loanedCount = units.filter((u) => u.status === "loaned").length;
    const totalCount = units.length;

    return {
      data: {
        ...book,
        availableCount,
        loanedCount,
        totalCount,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error in getBookById:", error);
    return { data: null, error: error as Error };
  }
}

export async function createBook(
  bookData: Omit<BookInsert, "id" | "created_at" | "updated_at">,
  quantity: number = 1
) {
  try {
    const supabase = createAdminClient();
    const { data: book, error: bookError } = await supabase
      .from("books")
      .insert(bookData)
      .select()
      .single();

    if (bookError || !book) {
      console.error("Error creating book:", bookError);
      throw bookError;
    }

    const qty = Math.max(1, quantity);
    const units = Array.from({ length: qty }, () => ({
      book_id: book.id,
      status: "available" as const,
    }));

    const { error: unitsError } = await supabase.from("book_units").insert(units);

    if (unitsError) {
      console.error("Error creating book units:", unitsError);
      await supabase.from("books").delete().eq("id", book.id);
      throw unitsError;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/books");

    return { data: book, error: null };
  } catch (error) {
    console.error("Error in createBook:", error);
    return { data: null, error: error as Error };
  }
}

export async function updateBook(id: string, bookData: BookUpdate) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("books")
      .update(bookData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating book:", error);
      throw error;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/books");
    revalidatePath(`/dashboard/books/${id}`);

    return { data, error: null };
  } catch (error) {
    console.error("Error in updateBook:", error);
    return { data: null, error: error as Error };
  }
}

export async function deleteBook(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("books").delete().eq("id", id);

    if (error) {
      console.error("Error deleting book:", error);
      throw error;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/books");

    return { error: null };
  } catch (error) {
    console.error("Error in deleteBook:", error);
    return { error: error as Error };
  }
}

export async function addBookUnits(bookId: string, count: number) {
  try {
    const supabase = createAdminClient();
    const qty = Math.max(1, count);
    const units = Array.from({ length: qty }, () => ({
      book_id: bookId,
      status: "available" as const,
    }));

    const { error } = await supabase.from("book_units").insert(units);

    if (error) {
      console.error("Error adding book units:", error);
      throw error;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/books");
    revalidatePath(`/dashboard/books/${bookId}`);

    return { error: null };
  } catch (error) {
    console.error("Error in addBookUnits:", error);
    return { error: error as Error };
  }
}

export async function removeBookUnit(unitId: string) {
  try {
    const supabase = createAdminClient();

    const { data: unit, error: fetchError } = await supabase
      .from("book_units")
      .select("id, status, book_id")
      .eq("id", unitId)
      .single();

    if (fetchError || !unit) {
      throw new Error("Unit not found");
    }

    if (unit.status !== "available") {
      throw new Error("Cannot remove unit that is loaned or in maintenance");
    }

    const { error } = await supabase
      .from("book_units")
      .delete()
      .eq("id", unitId);

    if (error) {
      console.error("Error removing book unit:", error);
      throw error;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/books");
    revalidatePath(`/dashboard/books/${unit.book_id}`);

    return { error: null };
  } catch (error) {
    console.error("Error in removeBookUnit:", error);
    return { error: error as Error };
  }
}

export async function getAvailableUnitsForBook(bookId: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("book_units")
      .select("id, book_id, status")
      .eq("book_id", bookId)
      .eq("status", "available");

    if (error) {
      console.error("Error fetching available units:", error);
      throw error;
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Error in getAvailableUnitsForBook:", error);
    return { data: [], error: error as Error };
  }
}
