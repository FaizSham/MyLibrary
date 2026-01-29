"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Grid3x3,
  List,
  Calendar,
  User,
  AlertTriangle,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
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
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Book } from "@/data/mock-books";
import { getBooks, createBook, updateBook, deleteBook } from "@/lib/actions/books";
import { transformBook } from "@/lib/utils/transform";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [copiedBookId, setCopiedBookId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publishedYear: "",
    quantity: "1",
  });

  const pathname = usePathname();
  const router = useRouter();

  // Fetch books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      setIsInitialLoad(true);
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
        setIsInitialLoad(false);
      }
    };
    fetchBooks();
  }, []);

  const handleOpenViewDialog = (book: Book) => {
    setViewingBook(book);
    setIsViewDialogOpen(true);
    // Update URL to include book ID
    router.push(`/dashboard/books/${book.id}`, { scroll: false });
  };

  // Check URL path on mount and open book view if book ID is present
  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const bookIdFromPath = pathSegments[pathSegments.length - 1];
    
    // Check if the last segment is a book ID (not "books" itself)
    if (bookIdFromPath && bookIdFromPath !== "books" && bookIdFromPath !== "dashboard") {
      const book = books.find((b) => b.id === bookIdFromPath);
      if (book) {
        // Only open dialog if not already viewing this book
        if (!viewingBook || viewingBook.id !== book.id) {
          setViewingBook(book);
          setIsViewDialogOpen(true);
        }
      }
    } else {
      // If URL doesn't have book ID, close dialog if open
      if (viewingBook && pathname === "/dashboard/books") {
        setIsViewDialogOpen(false);
        setViewingBook(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredBooks.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBooks = useMemo(() => {
    return filteredBooks.slice(startIndex, endIndex);
  }, [filteredBooks, startIndex, endIndex]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      genre: "",
      publishedYear: "",
      quantity: "1",
    });
    setEditingBook(null);
    setDialogMode("add");
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (book: Book) => {
    setEditingBook(book);
    setDialogMode("edit");
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      publishedYear: String(book.publishedYear),
      quantity: String(book.quantity),
    });
    setIsDialogOpen(true);
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await createBook({
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        genre: formData.genre,
        published_year: parseInt(formData.publishedYear),
        quantity: parseInt(formData.quantity),
        status: "available",
      });

      if (error) {
        throw error;
      }

      if (data) {
        const newBook = transformBook(data);
        setBooks([newBook, ...books]);
        resetForm();
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
      setIsLoading(false);
    }
  };

  const handleEditBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    setIsLoading(true);

    try {
      const { data, error } = await updateBook(editingBook.id, {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        genre: formData.genre,
        published_year: parseInt(formData.publishedYear),
        quantity: parseInt(formData.quantity),
      });

      if (error) {
        throw error;
      }

      if (data) {
        const updatedBook = transformBook(data);
        setBooks(books.map((book) => (book.id === editingBook.id ? updatedBook : book)));
        resetForm();
        setIsDialogOpen(false);
        toast.success("Book updated successfully", {
          description: `${updatedBook.title} has been updated.`,
        });
      }
    } catch (error) {
      toast.error("Failed to update book", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleViewDialogClose = (open: boolean) => {
    setIsViewDialogOpen(open);
    if (!open) {
      setViewingBook(null);
      // Reset URL to base books page when closing dialog
      router.replace("/dashboard/books", { scroll: false });
    }
  };

  const handleShareBook = async (book: Book) => {
    const shareUrl = `${window.location.origin}/dashboard/books/${book.id}`;
    
    try {
      // Try using Web Share API if available (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: `Check out "${book.title}" by ${book.author}`,
          text: `I found this great book: "${book.title}"`,
          url: shareUrl,
        });
        toast.success("Book shared successfully");
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setCopiedBookId(book.id);
        setTimeout(() => setCopiedBookId(null), 2000);
        toast.info("Link copied to clipboard", {
          description: "Share this link with others to view the book.",
        });
      }
    } catch {
      // If share fails or is cancelled, fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedBookId(book.id);
        setTimeout(() => setCopiedBookId(null), 2000);
        toast.info("Link copied to clipboard", {
          description: "Share this link with others to view the book.",
        });
      } catch {
        toast.error("Failed to copy link", {
          description: "Please try again later.",
        });
      }
    }
  };

  const handleOpenDeleteDialog = (book: Book) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    setIsDeleting(true);
    
    try {
      const deletedTitle = bookToDelete.title;
      const { error } = await deleteBook(bookToDelete.id);

      if (error) {
        throw error;
      }

      setBooks(books.filter((book) => book.id !== bookToDelete.id));
      setBookToDelete(null);
      setIsDeleteDialogOpen(false);
      toast.success("Book deleted successfully", {
        description: `${deletedTitle} has been removed from your collection.`,
      });
    } catch (error) {
      toast.error("Failed to delete book", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Books
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your library collection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button 
                className="gap-2"
                onClick={handleOpenAddDialog}
              >
                <Plus className="h-4 w-4" />
                Add New Book
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border">
            <form onSubmit={dialogMode === "edit" ? handleEditBook : handleAddBook} className="flex flex-col h-full max-h-[90vh]">
              <div className="px-6 py-6 border-b border-border">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    {dialogMode === "edit" ? "Edit Book" : "Add New Book"}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {dialogMode === "edit" 
                      ? "Update the details of this book in your collection."
                      : "Fill in the details below to add a new book to your library."}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="grid gap-6">
                  {/* Basic Information Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Basic Information</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                        <Input
                          id="title"
                          placeholder="e.g. The Great Gatsby"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="author">Author <span className="text-destructive">*</span></Label>
                        <Input
                          id="author"
                          placeholder="e.g. F. Scott Fitzgerald"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Book Details</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="isbn">ISBN <span className="text-destructive">*</span></Label>
                        <Input
                          id="isbn"
                          placeholder="e.g. 978-0-7432-7356-5"
                          value={formData.isbn}
                          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                          className="font-mono text-sm"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="genre">Genre <span className="text-destructive">*</span></Label>
                        <Input
                          id="genre"
                          placeholder="e.g. Fiction"
                          value={formData.genre}
                          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="publishedYear">Published Year <span className="text-destructive">*</span></Label>
                        <Input
                          id="publishedYear"
                          type="number"
                          placeholder="e.g. 1925"
                          value={formData.publishedYear}
                          onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="quantity">Quantity <span className="text-destructive">*</span></Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          placeholder="1"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-2 border-t border-border">
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogClose(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <LoadingButton type="submit" loading={isLoading} loadingText={dialogMode === "edit" ? "Saving..." : "Adding..."}>
                    {dialogMode === "edit" ? "Save Changes" : "Add Book"}
                  </LoadingButton>
                </DialogFooter>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Book Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={handleViewDialogClose}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border">
            {viewingBook && (
              <div className="flex flex-col h-full max-h-[90vh]">
                <div className="px-6 py-6 border-b border-border">
                  <DialogHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-lg border border-border shadow-sm">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <DialogTitle className="text-xl font-bold leading-tight">
                          {viewingBook.title}
                        </DialogTitle>
                        <p className="text-base font-medium text-muted-foreground">
                          {viewingBook.author}
                        </p>
                        <div className="pt-1">
                           <StatusBadge status={viewingBook.status} />
                        </div>
                      </div>
                    </div>
                  </DialogHeader>
                </div>
                
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Details</h4>
                      <div className="grid gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">ISBN</Label>
                          <p className="font-mono text-sm font-medium bg-muted px-2 py-1 rounded w-fit">
                            {viewingBook.isbn}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Genre</Label>
                          <p className="text-sm font-medium">{viewingBook.genre}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Year</Label>
                            <p className="text-sm font-medium">{viewingBook.publishedYear}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Quantity</Label>
                            <p className="text-sm font-medium">{viewingBook.quantity}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {(viewingBook.status === "loaned" || viewingBook.status === "overdue") && (
                       <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Loan Status</h4>
                        <div className="rounded-xl border border-border bg-muted/50 p-4 space-y-4">
                          {viewingBook.borrowedBy && (
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-background rounded-full shadow-sm border border-border">
                                <User className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-xs font-medium text-muted-foreground">Borrowed By</p>
                                <p className="text-sm font-semibold">{viewingBook.borrowedBy}</p>
                              </div>
                            </div>
                          )}
                          {viewingBook.dueDate && (
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full shadow-sm border ${viewingBook.status === "overdue" ? "bg-destructive/10 border-destructive/20" : "bg-background border-border"}`}>
                                <Calendar className={`h-4 w-4 ${viewingBook.status === "overdue" ? "text-destructive" : "text-muted-foreground"}`} />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-xs font-medium text-muted-foreground">Due Date</p>
                                <p className={`text-sm font-semibold ${viewingBook.status === "overdue" ? "text-destructive" : ""}`}>
                                  {new Date(viewingBook.dueDate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-2 border-t border-border">
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsViewDialogOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => viewingBook && handleShareBook(viewingBook)}
                    >
                      {viewingBook && copiedBookId === viewingBook.id ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Link Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setIsViewDialogOpen(false);
                        handleOpenEditDialog(viewingBook);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Book
                    </Button>
                  </DialogFooter>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="sm:max-w-[400px] border-border">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              
              <AlertDialogHeader className="mb-4">
                <AlertDialogTitle className="text-xl font-bold text-center">
                  Delete Book
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-sm max-w-xs mx-auto">
                  Are you sure you want to delete this book? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {bookToDelete && (
                <div className="w-full rounded-lg border border-border bg-muted/50 p-3 mb-6">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded border border-border shadow-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-semibold text-sm truncate">{bookToDelete.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{bookToDelete.author}</p>
                    </div>
                  </div>
                </div>
              )}

              <AlertDialogFooter className="grid grid-cols-2 gap-3 w-full">
                <AlertDialogCancel
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setBookToDelete(null);
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find books by title, author, ISBN, or genre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title, author, ISBN, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2 sm:w-[200px]">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="loaned">Loaned</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredBooks.length} of {books.length} books
          </div>
        </CardContent>
      </Card>

      {/* Books Display */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>All Books</CardTitle>
          <CardDescription>
            Complete list of books in your library collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No books found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first book."}
              </p>
            </div>
          ) : viewMode === "list" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[80px] text-muted-foreground font-semibold uppercase tracking-wider">Cover</TableHead>
                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">Title</TableHead>
                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">Author</TableHead>
                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">ISBN</TableHead>
                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">Genre</TableHead>
                    <TableHead className="w-[100px] text-muted-foreground font-semibold uppercase tracking-wider">Year</TableHead>
                    <TableHead className="w-[100px] text-muted-foreground font-semibold uppercase tracking-wider">Quantity</TableHead>
                    <TableHead className="w-[120px] text-muted-foreground font-semibold uppercase tracking-wider">Status</TableHead>
                    <TableHead className="w-[100px] text-right text-muted-foreground font-semibold uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBooks.map((book) => (
                    <TableRow 
                      key={book.id} 
                      className="border-border hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => handleOpenViewDialog(book)}
                    >
                      <TableCell>
                        <div className="flex h-12 w-10 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {book.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{book.author}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {book.isbn}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{book.genre}</TableCell>
                      <TableCell className="text-muted-foreground">{book.publishedYear}</TableCell>
                      <TableCell className="text-muted-foreground">{book.quantity}</TableCell>
                      <TableCell><StatusBadge status={book.status} /></TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => handleShareBook(book)}
                            title="Share book"
                            aria-label="Share book"
                          >
                            {copiedBookId === book.id ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Share2 className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => handleOpenEditDialog(book)}
                            title="Edit book"
                            aria-label="Edit book"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleOpenDeleteDialog(book)}
                            title="Delete book"
                            aria-label="Delete book"
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
                <Card 
                  key={book.id} 
                  className="group border-border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleOpenViewDialog(book)}
                >
                  <CardContent className="p-4">
                    <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{book.genre}</span>
                        <StatusBadge status={book.status} />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border" onClick={(e) => e.stopPropagation()}>
                        <span className="text-xs text-muted-foreground">Qty: {book.quantity}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => handleShareBook(book)}
                            title="Share book"
                            aria-label="Share book"
                          >
                            {copiedBookId === book.id ? (
                              <Check className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <Share2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => handleOpenEditDialog(book)}
                            title="Edit book"
                            aria-label="Edit book"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleOpenDeleteDialog(book)}
                            title="Delete book"
                            aria-label="Delete book"
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

          {/* Pagination Controls */}
          {filteredBooks.length > 0 && (
            <div className="border-t border-border px-6 py-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="pageSize" className="text-sm text-muted-foreground whitespace-nowrap">
                    Rows per page:
                  </Label>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger id="pageSize" className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Page Info and Navigation */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  {/* Page Info */}
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">
                      {filteredBooks.length === 0 ? 0 : startIndex + 1}
                    </span> to{" "}
                    <span className="font-medium text-foreground">
                      {Math.min(endIndex, filteredBooks.length)}
                    </span> of{" "}
                    <span className="font-medium text-foreground">
                      {filteredBooks.length}
                    </span> books
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous page</span>
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next page</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

