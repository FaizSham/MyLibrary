"use client";

import { useState } from "react";
import {
  BookOpen,
  FileText,
  AlertCircle,
  UserPlus,
  Plus,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockBooks, mockStats } from "@/data/mock-books";
import type { Book } from "@/data/mock-books";

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publishedYear: "",
    quantity: "1",
  });

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
    setFormData({ title: "", author: "", isbn: "", genre: "", publishedYear: "", quantity: "1" });
    setIsDialogOpen(false);
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
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Overview of your library management system
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm">
              <Plus className="h-4 w-4" />
              Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="border-stone-200">
            <form onSubmit={handleAddBook}>
              <DialogHeader>
                <DialogTitle className="text-stone-900">Add New Book</DialogTitle>
                <DialogDescription className="text-stone-600">
                  Enter the book details to add it to your collection.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-stone-700">Title</Label>
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
                  <Label htmlFor="author" className="text-stone-700">Author</Label>
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
                    <Label htmlFor="isbn" className="text-stone-700">ISBN</Label>
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
                    <Label htmlFor="quantity" className="text-stone-700">Quantity</Label>
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
                    <Label htmlFor="genre" className="text-stone-700">Genre</Label>
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
                    <Label htmlFor="publishedYear" className="text-stone-700">Published Year</Label>
                    <Input
                      id="publishedYear"
                      type="number"
                      placeholder="1925"
                      value={formData.publishedYear}
                      onChange={(e) =>
                        setFormData({ ...formData, publishedYear: e.target.value })
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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-stone-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Total Books</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <BookOpen className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900">{mockStats.totalBooks.toLocaleString()}</div>
            <p className="text-xs text-stone-500 mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Active Loans</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900">{mockStats.activeLoans}</div>
            <p className="text-xs text-stone-500 mt-1">
              {Math.round((mockStats.activeLoans / mockStats.totalBooks) * 100)}% of collection
            </p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Overdue Books</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockStats.overdueBooks}</div>
            <p className="text-xs text-stone-500 mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">New Members</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <UserPlus className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900">{mockStats.newMembers}</div>
            <p className="text-xs text-stone-500 mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Books Table */}
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-stone-900">Recent Books</CardTitle>
          <CardDescription className="text-stone-600">
            A list of recently added books in your collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-stone-200 hover:bg-transparent">
                <TableHead className="w-[100px] text-stone-500 font-semibold uppercase tracking-wider">Cover</TableHead>
                <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">Title</TableHead>
                <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">Author</TableHead>
                <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">ISBN</TableHead>
                <TableHead className="text-right text-stone-500 font-semibold uppercase tracking-wider">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id} className="border-stone-200 hover:bg-stone-50 transition-colors">
                  <TableCell>
                    <div className="flex h-12 w-10 items-center justify-center rounded-lg bg-stone-100 ring-1 ring-stone-200">
                      <BookOpen className="h-6 w-6 text-stone-400" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-stone-900">{book.title}</TableCell>
                  <TableCell className="text-stone-600">{book.author}</TableCell>
                  <TableCell className="font-mono text-sm text-stone-500">{book.isbn}</TableCell>
                  <TableCell className="text-right">
                    {getStatusBadge(book.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

