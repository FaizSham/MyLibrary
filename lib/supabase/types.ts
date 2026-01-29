// Database types matching Supabase schema
// These types will be generated from your Supabase schema
// For now, we'll define them manually based on the table structure

export type BookStatus = "available" | "loaned" | "overdue";
export type BorrowerStatus = "active" | "inactive" | "suspended";

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          isbn: string | null;
          genre: string | null;
          published_year: number | null;
          quantity: number;
          status: BookStatus;
          borrowed_by: string | null;
          due_date: string | null;
          cover_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author: string;
          isbn?: string | null;
          genre?: string | null;
          published_year?: number | null;
          quantity?: number;
          status?: BookStatus;
          borrowed_by?: string | null;
          due_date?: string | null;
          cover_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string;
          isbn?: string | null;
          genre?: string | null;
          published_year?: number | null;
          quantity?: number;
          status?: BookStatus;
          borrowed_by?: string | null;
          due_date?: string | null;
          cover_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      borrowers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          member_id: string;
          join_date: string;
          active_loans: number;
          total_loans: number;
          status: BorrowerStatus;
          fine_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          member_id: string;
          join_date: string;
          active_loans?: number;
          total_loans?: number;
          status?: BorrowerStatus;
          fine_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          member_id?: string;
          join_date?: string;
          active_loans?: number;
          total_loans?: number;
          status?: BorrowerStatus;
          fine_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
