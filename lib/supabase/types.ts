// Database types matching Supabase schema
// These types will be generated from your Supabase schema
// For now, we'll define them manually based on the table structure

export type BookUnitStatus = "available" | "loaned" | "maintenance";
export type BorrowerStatus = "active" | "inactive" | "suspended";
export type LoanStatus = "active" | "returned";

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
          cover_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      book_units: {
        Row: {
          id: string;
          book_id: string;
          status: BookUnitStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          status?: BookUnitStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string;
          status?: BookUnitStatus;
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
      loans: {
        Row: {
          id: string;
          book_unit_id: string;
          borrower_id: string;
          status: LoanStatus;
          checkout_date: string;
          due_date: string;
          return_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_unit_id: string;
          borrower_id: string;
          status?: LoanStatus;
          checkout_date?: string;
          due_date: string;
          return_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          book_unit_id?: string;
          borrower_id?: string;
          status?: LoanStatus;
          checkout_date?: string;
          due_date?: string;
          return_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
