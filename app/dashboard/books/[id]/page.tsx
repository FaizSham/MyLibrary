"use client";

import BooksPage from "../page";

export default function BookDetailPage() {
  // This route renders the same BooksPage component
  // The BooksPage component will detect the book ID from the URL pathname
  return <BooksPage />;
}

