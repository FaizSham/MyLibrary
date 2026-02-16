"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  Calendar,
  User,
  BookOpen,
  AlertTriangle,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
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
import { getLoans, createLoan, returnLoan } from "@/lib/actions/loans";
import { getBooks } from "@/lib/actions/books";
import { getBorrowers } from "@/lib/actions/borrowers";
import { transformBook, transformBorrower } from "@/lib/utils/transform";

type Loan = {
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
};

type Book = ReturnType<typeof transformBook>;
type Borrower = ReturnType<typeof transformBorrower>;

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [activeBorrowers, setActiveBorrowers] = useState<Borrower[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [viewingLoan, setViewingLoan] = useState<Loan | null>(null);
  const [loanToReturn, setLoanToReturn] = useState<Loan | null>(null);
  const [copiedLoanId, setCopiedLoanId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bookId: "",
    borrowerId: "",
    dueDate: "",
  });

  const pathname = usePathname();
  const router = useRouter();

  // Fetch loans on mount
  useEffect(() => {
    const fetchLoans = async () => {
      setIsInitialLoad(true);
      try {
        const { data, error } = await getLoans();
        if (error) {
          toast.error("Failed to load loans", {
            description: error.message || "Please try again later.",
          });
        } else {
          setLoans(data);
        }
      } catch (error) {
        toast.error("Failed to load loans", {
          description: "Please try again later.",
        });
      } finally {
        setIsInitialLoad(false);
      }
    };
    fetchLoans();
  }, []);

  // Fetch available books and active borrowers for checkout dialog
  useEffect(() => {
    const fetchData = async () => {
      const [booksResult, borrowersResult] = await Promise.all([
        getBooks({ status: "available" }),
        getBorrowers({ status: "active" }),
      ]);

      if (booksResult.data) {
        setAvailableBooks(booksResult.data.map(transformBook));
      }
      if (borrowersResult.data) {
        setActiveBorrowers(borrowersResult.data.map(transformBorrower));
      }
    };
    fetchData();
  }, []);

  const handleOpenViewDialog = (loan: Loan) => {
    setViewingLoan(loan);
    setIsViewDialogOpen(true);
    router.push(`/dashboard/loans/${loan.id}`, { scroll: false });
  };

  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const loanIdFromPath = pathSegments[pathSegments.length - 1];

    if (
      loanIdFromPath &&
      loanIdFromPath !== "loans" &&
      loanIdFromPath !== "dashboard"
    ) {
      const loan = loans.find((l) => l.id === loanIdFromPath);
      if (loan && (!viewingLoan || viewingLoan.id !== loan.id)) {
        setViewingLoan(loan);
        setIsViewDialogOpen(true);
      }
    } else if (viewingLoan && pathname === "/dashboard/loans") {
      setIsViewDialogOpen(false);
      setViewingLoan(null);
    }
  }, [pathname, loans, viewingLoan]);

  // Filter loans based on search and status
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesSearch =
        loan.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.bookAuthor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.borrowerMemberId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "overdue" && loan.status === "overdue") ||
        (statusFilter === "active" && loan.status === "active") ||
        (statusFilter === "returned" && loan.status === "returned");

      return matchesSearch && matchesStatus;
    });
  }, [loans, searchQuery, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredLoans.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLoans = useMemo(() => {
    return filteredLoans.slice(startIndex, endIndex);
  }, [filteredLoans, startIndex, endIndex]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const resetForm = () => {
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setFormData({
      bookId: "",
      borrowerId: "",
      dueDate: defaultDueDate.toISOString().split("T")[0],
    });
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleCheckOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookId || !formData.borrowerId) {
      toast.error("Please select both book and borrower");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await createLoan(
        formData.bookId,
        formData.borrowerId,
        formData.dueDate || undefined
      );

      if (error) {
        throw error;
      }

      if (data) {
        // Refresh loans list
        const { data: updatedLoans } = await getLoans();
        if (updatedLoans) {
          setLoans(updatedLoans);
        }

        // Refresh available books and borrowers
        const [booksResult, borrowersResult] = await Promise.all([
          getBooks({ status: "available" }),
          getBorrowers({ status: "active" }),
        ]);
        if (booksResult.data) {
          setAvailableBooks(booksResult.data.map(transformBook));
        }
        if (borrowersResult.data) {
          setActiveBorrowers(borrowersResult.data.map(transformBorrower));
        }

        resetForm();
        setIsDialogOpen(false);
        toast.success("Book checked out successfully", {
          description: "The loan has been created and the book status updated.",
        });
      }
    } catch (error) {
      toast.error("Failed to check out book", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
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
      setViewingLoan(null);
      router.replace("/dashboard/loans", { scroll: false });
    }
  };

  const handleShareLoan = async (loan: Loan) => {
    const shareUrl = `${window.location.origin}/dashboard/loans/${loan.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Loan: ${loan.bookTitle}`,
          text: `Book: ${loan.bookTitle} borrowed by ${loan.borrowerName}`,
          url: shareUrl,
        });
        toast.success("Loan shared successfully");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLoanId(loan.id);
        setTimeout(() => setCopiedLoanId(null), 2000);
        toast.info("Link copied to clipboard", {
          description: "Share this link to view the loan.",
        });
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLoanId(loan.id);
        setTimeout(() => setCopiedLoanId(null), 2000);
        toast.info("Link copied to clipboard", {
          description: "Share this link to view the loan.",
        });
      } catch {
        toast.error("Failed to copy link", {
          description: "Please try again later.",
        });
      }
    }
  };

  const handleOpenReturnDialog = (loan: Loan) => {
    setLoanToReturn(loan);
    setIsReturnDialogOpen(true);
  };

  const handleConfirmReturn = async () => {
    if (!loanToReturn) return;
    setIsReturning(true);

    try {
      const { error } = await returnLoan(loanToReturn.id);

      if (error) {
        throw error;
      }

      // Refresh loans list
      const { data: updatedLoans } = await getLoans();
      if (updatedLoans) {
        setLoans(updatedLoans);
      }

      // Refresh available books
      const booksResult = await getBooks({ status: "available" });
      if (booksResult.data) {
        setAvailableBooks(booksResult.data.map(transformBook));
      }

      setLoanToReturn(null);
      setIsReturnDialogOpen(false);
      setIsViewDialogOpen(false);
      setViewingLoan(null);
      router.replace("/dashboard/loans", { scroll: false });
      toast.success("Book returned successfully", {
        description: `${loanToReturn.bookTitle} has been returned.`,
      });
    } catch (error) {
      toast.error("Failed to return book", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsReturning(false);
    }
  };

  // Calculate stats
  const loanStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      activeLoans: loans.filter((l) => l.status === "active").length,
      overdueLoans: loans.filter((l) => l.status === "overdue").length,
      returnedToday: loans.filter(
        (l) => l.status === "returned" && l.returnDate === today
      ).length,
      totalLoans: loans.length,
    };
  }, [loans]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Loans
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage book checkouts and returns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={handleOpenAddDialog}>
                <Plus className="h-4 w-4" />
                Check Out Book
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border">
              <form
                onSubmit={handleCheckOut}
                className="flex flex-col h-full max-h-[90vh]"
              >
                <div className="px-6 py-6 border-b border-border">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Check Out Book
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Select a book and borrower to create a new loan.
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="grid gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Loan Details
                      </h4>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="bookId">
                            Book <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={formData.bookId}
                            onValueChange={(value) =>
                              setFormData({ ...formData, bookId: value })
                            }
                            required
                            disabled={isLoading}
                          >
                            <SelectTrigger id="bookId">
                              <SelectValue placeholder="Select a book" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableBooks.length === 0 ? (
                                <SelectItem value="none" disabled>
                                  No available books
                                </SelectItem>
                              ) : (
                                availableBooks.map((book) => (
                                  <SelectItem key={book.id} value={book.id}>
                                    {book.title} by {book.author}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="borrowerId">
                            Borrower <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={formData.borrowerId}
                            onValueChange={(value) =>
                              setFormData({ ...formData, borrowerId: value })
                            }
                            required
                            disabled={isLoading}
                          >
                            <SelectTrigger id="borrowerId">
                              <SelectValue placeholder="Select a borrower" />
                            </SelectTrigger>
                            <SelectContent>
                              {activeBorrowers.length === 0 ? (
                                <SelectItem value="none" disabled>
                                  No active borrowers
                                </SelectItem>
                              ) : (
                                activeBorrowers.map((borrower) => (
                                  <SelectItem
                                    key={borrower.id}
                                    value={borrower.id}
                                  >
                                    {borrower.name} ({borrower.memberId})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dueDate">
                            Due Date <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) =>
                              setFormData({ ...formData, dueDate: e.target.value })
                            }
                            required
                            disabled={isLoading}
                            min={new Date().toISOString().split("T")[0]}
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
                    <LoadingButton
                      type="submit"
                      loading={isLoading}
                      loadingText="Checking out..."
                    >
                      Check Out Book
                    </LoadingButton>
                  </DialogFooter>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* View Loan Details Dialog */}
          <Dialog
            open={isViewDialogOpen}
            onOpenChange={handleViewDialogClose}
          >
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border">
              {viewingLoan && (
                <div className="flex flex-col h-full max-h-[90vh]">
                  <div className="px-6 py-6 border-b border-border">
                    <DialogHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-lg border border-border shadow-sm">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <DialogTitle className="text-xl font-bold leading-tight">
                            {viewingLoan.bookTitle}
                          </DialogTitle>
                          <p className="text-base font-medium text-muted-foreground">
                            {viewingLoan.bookAuthor}
                          </p>
                          <div className="pt-1">
                            <StatusBadge status={viewingLoan.status} />
                          </div>
                        </div>
                      </div>
                    </DialogHeader>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                          Book Information
                        </h4>
                        <div className="grid gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Title
                            </Label>
                            <p className="text-sm font-medium">
                              {viewingLoan.bookTitle}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Author
                            </Label>
                            <p className="text-sm font-medium">
                              {viewingLoan.bookAuthor}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                          Borrower Information
                        </h4>
                        <div className="grid gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Name
                            </Label>
                            <p className="text-sm font-medium">
                              {viewingLoan.borrowerName}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Member ID
                            </Label>
                            <p className="font-mono text-sm font-medium bg-muted px-2 py-1 rounded w-fit">
                              {viewingLoan.borrowerMemberId}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 sm:col-span-2">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                          Loan Dates
                        </h4>
                        <div className="rounded-xl border border-border bg-muted/50 p-4 space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-background rounded-full shadow-sm border border-border">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-medium text-muted-foreground">
                                Checkout Date
                              </p>
                              <p className="text-sm font-semibold">
                                {new Date(
                                  viewingLoan.checkoutDate
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`flex items-start gap-3 ${viewingLoan.status === "overdue" ? "opacity-100" : ""}`}
                          >
                            <div
                              className={`p-2 rounded-full shadow-sm border ${
                                viewingLoan.status === "overdue"
                                  ? "bg-destructive/10 border-destructive/20"
                                  : "bg-background border-border"
                              }`}
                            >
                              <Calendar
                                className={`h-4 w-4 ${
                                  viewingLoan.status === "overdue"
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-medium text-muted-foreground">
                                Due Date
                              </p>
                              <p
                                className={`text-sm font-semibold ${
                                  viewingLoan.status === "overdue"
                                    ? "text-destructive"
                                    : ""
                                }`}
                              >
                                {new Date(
                                  viewingLoan.dueDate
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          {viewingLoan.returnDate && (
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-background rounded-full shadow-sm border border-border">
                                <RotateCcw className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-xs font-medium text-muted-foreground">
                                  Return Date
                                </p>
                                <p className="text-sm font-semibold">
                                  {new Date(
                                    viewingLoan.returnDate
                                  ).toLocaleDateString("en-US", {
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
                    </div>
                  </div>

                  <div className="p-6 pt-2 border-t border-border">
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleViewDialogClose(false)}
                      >
                        Close
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          viewingLoan && handleShareLoan(viewingLoan)
                        }
                      >
                        {viewingLoan &&
                        copiedLoanId === viewingLoan.id ? (
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
                      {viewingLoan.status === "active" ||
                      viewingLoan.status === "overdue" ? (
                        <Button
                          type="button"
                          onClick={() =>
                            viewingLoan && handleOpenReturnDialog(viewingLoan)
                          }
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Return Book
                        </Button>
                      ) : null}
                    </DialogFooter>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Return Confirmation Dialog */}
          <AlertDialog
            open={isReturnDialogOpen}
            onOpenChange={setIsReturnDialogOpen}
          >
            <AlertDialogContent className="sm:max-w-[400px] border-border">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <RotateCcw className="h-6 w-6 text-primary" />
                </div>

                <AlertDialogHeader className="mb-4">
                  <AlertDialogTitle className="text-xl font-bold text-center">
                    Return Book
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-sm max-w-xs mx-auto">
                    Are you sure you want to return this book? This will mark
                    the loan as returned.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {loanToReturn && (
                  <div className="w-full rounded-lg border border-border bg-muted/50 p-3 mb-6">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded border border-border shadow-sm">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {loanToReturn.bookTitle}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Borrowed by {loanToReturn.borrowerName}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <AlertDialogFooter className="grid grid-cols-2 gap-3 w-full">
                  <AlertDialogCancel
                    onClick={() => {
                      setIsReturnDialogOpen(false);
                      setLoanToReturn(null);
                    }}
                    disabled={isReturning}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmReturn}
                    disabled={isReturning}
                  >
                    {isReturning ? "Returning..." : "Return Book"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Loans
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loanStats.activeLoans}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently checked out
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {loanStats.overdueLoans}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Returned Today
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <RotateCcw className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loanStats.returnedToday}
            </div>
            <p className="text-xs text-muted-foreground mt-1">This day</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Loans
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loanStats.totalLoans}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time loans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find loans by book title, author, borrower name, or member ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by book title, author, borrower name, or member ID..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredLoans.length} of {loans.length} loans
          </div>
        </CardContent>
      </Card>

      {/* Loans Display */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>All Loans</CardTitle>
          <CardDescription>
            Complete list of book loans and returns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLoans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">
                No loans found
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by checking out your first book."}
              </p>
            </div>
          ) : viewMode === "list" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">
                      Book
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">
                      Borrower
                    </TableHead>
                    <TableHead className="w-[120px] text-muted-foreground font-semibold uppercase tracking-wider">
                      Checkout Date
                    </TableHead>
                    <TableHead className="w-[120px] text-muted-foreground font-semibold uppercase tracking-wider">
                      Due Date
                    </TableHead>
                    <TableHead className="w-[120px] text-muted-foreground font-semibold uppercase tracking-wider">
                      Return Date
                    </TableHead>
                    <TableHead className="w-[120px] text-muted-foreground font-semibold uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="w-[100px] text-right text-muted-foreground font-semibold uppercase tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLoans.map((loan) => (
                    <TableRow
                      key={loan.id}
                      className="border-border hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => handleOpenViewDialog(loan)}
                    >
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground">
                            {loan.bookTitle}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {loan.bookAuthor}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground">
                            {loan.borrowerName}
                          </p>
                          <p className="font-mono text-sm text-muted-foreground">
                            {loan.borrowerMemberId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(loan.checkoutDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        className={
                          loan.status === "overdue"
                            ? "text-destructive font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {loan.returnDate
                          ? new Date(loan.returnDate).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={loan.status} />
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => handleShareLoan(loan)}
                            aria-label="Share loan"
                          >
                            {copiedLoanId === loan.id ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Share2 className="h-4 w-4" />
                            )}
                          </Button>
                          {(loan.status === "active" ||
                            loan.status === "overdue") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => handleOpenReturnDialog(loan)}
                              aria-label="Return book"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedLoans.map((loan) => (
                <Card
                  key={loan.id}
                  className="group border-border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleOpenViewDialog(loan)}
                >
                  <CardContent className="p-4">
                    <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground line-clamp-2">
                        {loan.bookTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {loan.bookAuthor}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {loan.borrowerName}
                        </span>
                        <StatusBadge status={loan.status} />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(loan.dueDate).toLocaleDateString()}
                        </span>
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => handleShareLoan(loan)}
                            aria-label="Share loan"
                          >
                            {copiedLoanId === loan.id ? (
                              <Check className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <Share2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          {(loan.status === "active" ||
                            loan.status === "overdue") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => handleOpenReturnDialog(loan)}
                              aria-label="Return book"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredLoans.length > 0 && (
            <div className="border-t border-border px-6 py-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="pageSize"
                    className="text-sm text-muted-foreground whitespace-nowrap"
                  >
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

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {filteredLoans.length === 0 ? 0 : startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-foreground">
                      {Math.min(endIndex, filteredLoans.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                      {filteredLoans.length}
                    </span>{" "}
                    loans
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous page</span>
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
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
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(totalPages, prev + 1)
                        )
                      }
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
