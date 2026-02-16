export interface Loan {
  id: string;
  bookId: string;
  borrowerId: string;
  bookTitle: string;
  bookAuthor: string;
  borrowerName: string;
  borrowerMemberId: string;
  checkoutDate: string;
  dueDate: string;
  returnDate?: string;
  status: "active" | "returned" | "overdue";
}

export const mockLoans: Loan[] = [
  {
    id: "1",
    bookId: "2",
    borrowerId: "1",
    bookTitle: "To Kill a Mockingbird",
    bookAuthor: "Harper Lee",
    borrowerName: "John Smith",
    borrowerMemberId: "MEM-001",
    checkoutDate: "2024-01-01",
    dueDate: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    bookId: "3",
    borrowerId: "2",
    bookTitle: "1984",
    bookAuthor: "George Orwell",
    borrowerName: "Sarah Johnson",
    borrowerMemberId: "MEM-002",
    checkoutDate: "2023-12-06",
    dueDate: "2023-12-20",
    status: "overdue",
  },
  {
    id: "3",
    bookId: "5",
    borrowerId: "3",
    bookTitle: "The Catcher in the Rye",
    bookAuthor: "J.D. Salinger",
    borrowerName: "Mike Davis",
    borrowerMemberId: "MEM-003",
    checkoutDate: "2024-01-04",
    dueDate: "2024-01-18",
    status: "active",
  },
];
