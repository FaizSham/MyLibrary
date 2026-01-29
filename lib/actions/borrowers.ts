"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/supabase/types";

type Borrower = Database["public"]["Tables"]["borrowers"]["Row"];
type BorrowerInsert = Database["public"]["Tables"]["borrowers"]["Insert"];
type BorrowerUpdate = Database["public"]["Tables"]["borrowers"]["Update"];

export async function getBorrowers(filters?: {
  status?: "active" | "inactive" | "suspended";
  search?: string;
}) {
  try {
    const supabase = createAdminClient();
    let query = supabase.from("borrowers").select("*").order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,member_id.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching borrowers:", error);
      throw error;
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Error in getBorrowers:", error);
    return { data: [], error: error as Error };
  }
}

export async function getBorrowerById(id: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("borrowers").select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching borrower:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error in getBorrowerById:", error);
    return { data: null, error: error as Error };
  }
}

export async function createBorrower(
  borrowerData: Omit<BorrowerInsert, "id" | "created_at" | "updated_at" | "active_loans" | "total_loans">
) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("borrowers")
      .insert({
        ...borrowerData,
        status: borrowerData.status || "active",
        active_loans: 0,
        total_loans: 0,
        fine_amount: borrowerData.fine_amount || 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating borrower:", error);
      throw error;
    }

    revalidatePath("/dashboard/borrowers");

    return { data, error: null };
  } catch (error) {
    console.error("Error in createBorrower:", error);
    return { data: null, error: error as Error };
  }
}

export async function updateBorrower(id: string, borrowerData: BorrowerUpdate) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("borrowers")
      .update(borrowerData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating borrower:", error);
      throw error;
    }

    revalidatePath("/dashboard/borrowers");

    return { data, error: null };
  } catch (error) {
    console.error("Error in updateBorrower:", error);
    return { data: null, error: error as Error };
  }
}

export async function deleteBorrower(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("borrowers").delete().eq("id", id);

    if (error) {
      console.error("Error deleting borrower:", error);
      throw error;
    }

    revalidatePath("/dashboard/borrowers");

    return { error: null };
  } catch (error) {
    console.error("Error in deleteBorrower:", error);
    return { error: error as Error };
  }
}

