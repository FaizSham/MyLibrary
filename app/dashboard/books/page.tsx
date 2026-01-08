"use client";

import { useState, useMemo } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Grid3x3,
  List,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockBooks } from "@/data/mock-books";
import type { Book } from "@/data/mock-books";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publishedYear: "",
    quantity: "1",
  });

  // Filter books based on search and status
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || book.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [books, searchQuery, statusFilter]);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newBook: Book = {
      id: String(books.length + 1),
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn,
      genre: formData.genre,
      publishedYear: parseInt(formData.publishedYear),
      quantity: parseInt(formData.quantity),
      status: "available",
    };
    setBooks([newBook, ...books]);
    setFormData({
      title: "",
      author: "",
      isbn: "",
      genre: "",
      publishedYear: "",
      quantity: "1",
    });
    setIsDialogOpen(false);
  };

  const handleDeleteBook = (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  const getStatusBadge = (status: Book["status"]) => {
    const variants = {
      available: { variant: "default" as const, className: "bg-green-50 text-green-700 border-green-200" },
      loaned: { variant: "secondary" as const, className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
      overdue: { variant: "destructive" as const, className: "bg-red-50 text-red-700 border-red-200" },
    } as const;

    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Books
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Manage your library collection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white p-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${viewMode === "list" ? "bg-indigo-50 text-indigo-600" : "text-stone-600 hover:text-stone-900"}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${viewMode === "grid" ? "bg-indigo-50 text-indigo-600" : "text-stone-600 hover:text-stone-900"}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm">
                <Plus className="h-4 w-4" />
                Add New Book
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] border-stone-200">
            <form onSubmit={handleAddBook}>
              <DialogHeader>
                <DialogTitle className="text-stone-900">Add New Book</DialogTitle>
                <DialogDescription className="text-stone-600">
                  Enter the book details to add it to your collection.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-stone-700">Title *</Label>
                  <Input
                    id="title"
                    placeholder="The Great Gatsby"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="author" className="text-stone-700">Author *</Label>
                  <Input
                    id="author"
                    placeholder="F. Scott Fitzgerald"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="isbn" className="text-stone-700">ISBN *</Label>
                    <Input
                      id="isbn"
                      placeholder="978-0-7432-7356-5"
                      value={formData.isbn}
                      onChange={(e) =>
                        setFormData({ ...formData, isbn: e.target.value })
                      }
                      className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity" className="text-stone-700">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="genre" className="text-stone-700">Genre *</Label>
                    <Input
                      id="genre"
                      placeholder="Fiction"
                      value={formData.genre}
                      onChange={(e) =>
                        setFormData({ ...formData, genre: e.target.value })
                      }
                      className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="publishedYear" className="text-stone-700">Published Year *</Label>
                    <Input
                      id="publishedYear"
                      type="number"
                      placeholder="1925"
                      value={formData.publishedYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publishedYear: e.target.value,
                        })
                      }
                      className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-stone-200 text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">Add Book</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-stone-900">Search & Filter</CardTitle>
          <CardDescription className="text-stone-600">
            Find books by title, author, ISBN, or genre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                type="search"
                placeholder="Search by title, author, ISBN, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-stone-200 bg-white pl-9 text-stone-900 placeholder:text-stone-500 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <div className="flex items-center gap-2 sm:w-[200px]">
              <Filter className="h-4 w-4 text-stone-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-stone-200 text-stone-900">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="border-stone-200">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="loaned">Loaned</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-stone-500">
            Showing {filteredBooks.length} of {books.length} books
          </div>
        </CardContent>
      </Card>

      {/* Books Display */}
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-stone-900">All Books</CardTitle>
          <CardDescription className="text-stone-600">
            Complete list of books in your library collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-stone-400 mb-4" />
              <p className="text-lg font-medium text-stone-900">No books found</p>
              <p className="text-sm text-stone-500 mt-2">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first book."}
              </p>
            </div>
          ) : viewMode === "list" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-stone-200 hover:bg-transparent">
                    <TableHead className="w-[80px] text-stone-500 font-semibold uppercase tracking-wider">Cover</TableHead>
                    <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">Title</TableHead>
                    <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">Author</TableHead>
                    <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">ISBN</TableHead>
                    <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">Genre</TableHead>
                    <TableHead className="w-[100px] text-stone-500 font-semibold uppercase tracking-wider">Year</TableHead>
                    <TableHead className="w-[100px] text-stone-500 font-semibold uppercase tracking-wider">Quantity</TableHead>
                    <TableHead className="w-[120px] text-stone-500 font-semibold uppercase tracking-wider">Status</TableHead>
                    <TableHead className="w-[100px] text-right text-stone-500 font-semibold uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book) => (
                    <TableRow key={book.id} className="border-stone-200 hover:bg-stone-50 transition-colors">
                      <TableCell>
                        <div className="flex h-12 w-10 items-center justify-center rounded-lg bg-stone-100 ring-1 ring-stone-200">
                          <BookOpen className="h-6 w-6 text-stone-400" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-stone-900">{book.title}</TableCell>
                      <TableCell className="text-stone-600">{book.author}</TableCell>
                      <TableCell className="font-mono text-sm text-stone-500">
                        {book.isbn}
                      </TableCell>
                      <TableCell className="text-stone-600">{book.genre}</TableCell>
                      <TableCell className="text-stone-600">{book.publishedYear}</TableCell>
                      <TableCell className="text-stone-600">{book.quantity}</TableCell>
                      <TableCell>{getStatusBadge(book.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                            onClick={() => {
                              // Edit functionality can be added later
                              alert("Edit functionality coming soon!");
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="group border-stone-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-stone-100 ring-1 ring-stone-200">
                      <BookOpen className="h-12 w-12 text-stone-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-stone-900 line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-stone-600">{book.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-stone-500">{book.genre}</span>
                        {getStatusBadge(book.status)}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                        <span className="text-xs text-stone-500">Qty: {book.quantity}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                            onClick={() => {
                              alert("Edit functionality coming soon!");
                            }}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

