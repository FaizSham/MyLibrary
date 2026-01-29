"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/types";

type Book = Database["public"]["Tables"]["books"]["Row"];
type BookInsert = Database["public"]["Tables"]["books"]["Insert"];
type BookUpdate = Database["public"]["Tables"]["books"]["Update"];

export async function getBooks(filters?: {
  status?: "available" | "loaned" | "overdue";
  search?: string;
}) {
  try {
    const supabase = createAdminClient();
    let query = supabase.from("books").select("*").order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

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

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Error in getBooks:", error);
    return { data: [], error: error as Error };
  }
}

export async function getBookById(id: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("books").select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching book:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error in getBookById:", error);
    return { data: null, error: error as Error };
  }
}

export async function createBook(bookData: Omit<BookInsert, "id" | "created_at" | "updated_at">) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("books")
      .insert({
        ...bookData,
        status: bookData.status || "available",
        quantity: bookData.quantity || 1,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating book:", error);
      throw error;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/books");

    return { data, error: null };
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

