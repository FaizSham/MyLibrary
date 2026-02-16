"use client";
import {
  BookOpen,
  FileText,
  AlertCircle,
  UserPlus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
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
import { useEffect, useState } from "react";
import { getBooks, createBook, getBookById } from "@/lib/actions/books";
import { transformBook } from "@/lib/utils/transform";

type Book = ReturnType<typeof transformBook>;

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error } = await getBooks();
        if (error) {
          toast.error("Failed to load books", {
            description: error.message || "Please try again later.",
          });
        } else {
          setBooks(data.map(transformBook));
        }
      } catch (error) {
        toast.error("Failed to load books", {
          description: "Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Calculate stats from books
  const mockStats = {
    totalBooks: books.length,
    activeLoans: books.reduce((sum, b) => sum + (b.loanedCount ?? 0), 0),
    overdueBooks: 0, // Would need to fetch loans for accurate overdue count
    newMembers: 0, // This would come from borrowers data
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publishedYear: "",
    quantity: "1",
  });

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const quantity = Math.max(1, parseInt(formData.quantity) || 1);
      const { data, error } = await createBook(
        {
          title: formData.title,
          author: formData.author,
          isbn: formData.isbn || null,
          genre: formData.genre || null,
          published_year: parseInt(formData.publishedYear) || null,
        },
        quantity
      );

      if (error) {
        throw error;
      }

      if (data) {
        const { data: fullBook } = await getBookById(data.id);
        const newBook = fullBook ? transformBook(fullBook) : transformBook({ ...data, availableCount: quantity, loanedCount: 0, totalCount: quantity });
        setBooks([newBook, ...books]);
        setFormData({ title: "", author: "", isbn: "", genre: "", publishedYear: "", quantity: "1" });
        setIsDialogOpen(false);
        toast.success("Book added successfully", {
          description: `${newBook.title} by ${newBook.author} has been added to your collection.`,
        });
      }
    } catch (error) {
      toast.error("Failed to add book", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Overview of your library management system
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border">
            <form onSubmit={handleAddBook}>
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>
                  Enter the book details to add it to your collection.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="The Great Gatsby"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    placeholder="F. Scott Fitzgerald"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      placeholder="978-0-7432-7356-5"
                      value={formData.isbn}
                      onChange={(e) =>
                        setFormData({ ...formData, isbn: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      placeholder="Fiction"
                      value={formData.genre}
                      onChange={(e) =>
                        setFormData({ ...formData, genre: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="publishedYear">Published Year</Label>
                    <Input
                      id="publishedYear"
                      type="number"
                      placeholder="1925"
                      value={formData.publishedYear}
                      onChange={(e) =>
                        setFormData({ ...formData, publishedYear: e.target.value })
                      }
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <LoadingButton type="submit" loading={isSubmitting} loadingText="Adding...">
                  Add Book
                </LoadingButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Books</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockStats.totalBooks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Loans</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockStats.activeLoans}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((mockStats.activeLoans / mockStats.totalBooks) * 100)}% of collection
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Books</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{mockStats.overdueBooks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Members</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockStats.newMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Books Table */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Recent Books</CardTitle>
          <CardDescription>
            A list of recently added books in your collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No books found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Get started by adding your first book.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[100px] text-muted-foreground font-semibold uppercase tracking-wider">Cover</TableHead>
                  <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">Title</TableHead>
                  <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">Author</TableHead>
                  <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">ISBN</TableHead>
                  <TableHead className="text-right text-muted-foreground font-semibold uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id} className="border-border hover:bg-accent transition-colors">
                    <TableCell>
                      <div className="flex h-12 w-10 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                        <BookOpen className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{book.title}</TableCell>
                    <TableCell className="text-muted-foreground">{book.author}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{book.isbn}</TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={book.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

