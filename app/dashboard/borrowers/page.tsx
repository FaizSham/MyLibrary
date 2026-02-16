"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  AlertCircle,
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Grid3x3,
  List,
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
import type { Borrower } from "@/data/mock-borrowers";
import {
  getBorrowers,
  createBorrower,
  updateBorrower,
  deleteBorrower,
} from "@/lib/actions/borrowers";
import { transformBorrower } from "@/lib/utils/transform";

export default function BorrowersPage() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
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
  const [viewingBorrower, setViewingBorrower] = useState<Borrower | null>(null);
  const [editingBorrower, setEditingBorrower] = useState<Borrower | null>(null);
  const [borrowerToDelete, setBorrowerToDelete] = useState<Borrower | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [copiedBorrowerId, setCopiedBorrowerId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    memberId: "",
    joinDate: "",
    status: "active" as "active" | "inactive" | "suspended",
    fineAmount: "",
  });

  const pathname = usePathname();
  const router = useRouter();

  // Fetch borrowers on mount
  useEffect(() => {
    const fetchBorrowers = async () => {
      setIsInitialLoad(true);
      try {
        const { data, error } = await getBorrowers();
        if (error) {
          toast.error("Failed to load borrowers", {
            description: error.message || "Please try again later.",
          });
        } else {
          setBorrowers(data.map(transformBorrower));
        }
      } catch {
        toast.error("Failed to load borrowers", {
          description: "Please try again later.",
        });
      } finally {
        setIsInitialLoad(false);
      }
    };
    fetchBorrowers();
  }, []);

  const handleOpenViewDialog = (borrower: Borrower) => {
    setViewingBorrower(borrower);
    setIsViewDialogOpen(true);
    router.push(`/dashboard/borrowers/${borrower.id}`, { scroll: false });
  };

  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const borrowerIdFromPath = pathSegments[pathSegments.length - 1];

    if (
      borrowerIdFromPath &&
      borrowerIdFromPath !== "borrowers" &&
      borrowerIdFromPath !== "dashboard"
    ) {
      const borrower = borrowers.find((b) => b.id === borrowerIdFromPath);
      if (borrower && (!viewingBorrower || viewingBorrower.id !== borrower.id)) {
        setViewingBorrower(borrower);
        setIsViewDialogOpen(true);
      }
    } else if (viewingBorrower && pathname === "/dashboard/borrowers") {
      setIsViewDialogOpen(false);
      setViewingBorrower(null);
    }
  }, [pathname, borrowers, viewingBorrower]);

  const filteredBorrowers = useMemo(() => {
    return borrowers.filter((borrower) => {
      const matchesSearch =
        borrower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrower.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrower.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (borrower.phone &&
          borrower.phone.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || borrower.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [borrowers, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredBorrowers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBorrowers = useMemo(() => {
    return filteredBorrowers.slice(startIndex, endIndex);
  }, [filteredBorrowers, startIndex, endIndex]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      memberId: "",
      joinDate: "",
      status: "active",
      fineAmount: "",
    });
    setEditingBorrower(null);
    setDialogMode("add");
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setFormData((prev) => ({
      ...prev,
      joinDate: new Date().toISOString().split("T")[0],
    }));
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (borrower: Borrower) => {
    setEditingBorrower(borrower);
    setDialogMode("edit");
    setFormData({
      name: borrower.name,
      email: borrower.email,
      phone: borrower.phone || "",
      memberId: borrower.memberId,
      joinDate: borrower.joinDate.split("T")[0],
      status: borrower.status,
      fineAmount: borrower.fineAmount ? String(borrower.fineAmount) : "",
    });
    setIsDialogOpen(true);
  };

  const handleAddBorrower = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const memberId =
        formData.memberId ||
        `MEM-${String(borrowers.length + 1).padStart(3, "0")}`;
      const { data, error } = await createBorrower({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        member_id: memberId,
        join_date: formData.joinDate || new Date().toISOString().split("T")[0],
        status: "active",
      });

      if (error) throw error;

      if (data) {
        const newBorrower = transformBorrower(data);
        setBorrowers([newBorrower, ...borrowers]);
        resetForm();
        setIsDialogOpen(false);
        toast.success("Borrower added successfully", {
          description: `${newBorrower.name} has been added to your library system.`,
        });
      }
    } catch (error) {
      toast.error("Failed to add borrower", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBorrower = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBorrower) return;
    setIsLoading(true);

    try {
      const { data, error } = await updateBorrower(editingBorrower.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        member_id: formData.memberId,
        join_date: formData.joinDate,
        status: formData.status,
        fine_amount: formData.fineAmount ? parseFloat(formData.fineAmount) : 0,
      });

      if (error) throw error;

      if (data) {
        const updatedBorrower = transformBorrower(data);
        setBorrowers(
          borrowers.map((b) =>
            b.id === editingBorrower.id ? updatedBorrower : b
          )
        );
        resetForm();
        setIsDialogOpen(false);
        setIsViewDialogOpen(false);
        setViewingBorrower(updatedBorrower);
        toast.success("Borrower updated successfully", {
          description: `${updatedBorrower.name} has been updated.`,
        });
      }
    } catch (error) {
      toast.error("Failed to update borrower", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  };

  const handleViewDialogClose = (open: boolean) => {
    setIsViewDialogOpen(open);
    if (!open) {
      setViewingBorrower(null);
      router.replace("/dashboard/borrowers", { scroll: false });
    }
  };

  const handleShareBorrower = async (borrower: Borrower) => {
    const shareUrl = `${window.location.origin}/dashboard/borrowers/${borrower.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Borrower: ${borrower.name}`,
          text: `Library member: ${borrower.name} (${borrower.memberId})`,
          url: shareUrl,
        });
        toast.success("Borrower shared successfully");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedBorrowerId(borrower.id);
        setTimeout(() => setCopiedBorrowerId(null), 2000);
        toast.info("Link copied to clipboard", {
          description: "Share this link to view the borrower.",
        });
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedBorrowerId(borrower.id);
        setTimeout(() => setCopiedBorrowerId(null), 2000);
        toast.info("Link copied to clipboard", {
          description: "Share this link to view the borrower.",
        });
      } catch {
        toast.error("Failed to copy link", {
          description: "Please try again later.",
        });
      }
    }
  };

  const handleOpenDeleteDialog = (borrower: Borrower) => {
    setBorrowerToDelete(borrower);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!borrowerToDelete) return;
    setIsDeleting(true);

    try {
      const deletedName = borrowerToDelete.name;
      const { error } = await deleteBorrower(borrowerToDelete.id);

      if (error) throw error;

      setBorrowers(borrowers.filter((b) => b.id !== borrowerToDelete.id));
      setBorrowerToDelete(null);
      setIsDeleteDialogOpen(false);
      setIsViewDialogOpen(false);
      setViewingBorrower(null);
      router.replace("/dashboard/borrowers", { scroll: false });
      toast.success("Borrower deleted successfully", {
        description: `${deletedName} has been removed from your library.`,
      });
    } catch (error) {
      toast.error("Failed to delete borrower", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const borrowerStats = {
    totalBorrowers: borrowers.length,
    activeBorrowers: borrowers.filter((b) => b.status === "active").length,
    inactiveBorrowers: borrowers.filter((b) => b.status === "inactive").length,
    suspendedBorrowers: borrowers.filter((b) => b.status === "suspended")
      .length,
    totalFines: borrowers.reduce((sum, b) => sum + (b.fineAmount || 0), 0),
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Borrowers
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage library members and borrowers
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
                Add New Borrower
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border">
              <form
                onSubmit={
                  dialogMode === "edit" ? handleEditBorrower : handleAddBorrower
                }
                className="flex flex-col h-full max-h-[90vh]"
              >
                <div className="px-6 py-6 border-b border-border">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      {dialogMode === "edit"
                        ? "Edit Borrower"
                        : "Add New Borrower"}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {dialogMode === "edit"
                        ? "Update the details of this borrower."
                        : "Fill in the details below to add a new borrower."}
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="grid gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Basic Information
                      </h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2 sm:col-span-2">
                          <Label htmlFor="name">
                            Full Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">
                            Email <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            disabled={isLoading}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="memberId">
                            Member ID{dialogMode === "edit" && <span className="text-destructive"> *</span>}
                          </Label>
                          <Input
                            id="memberId"
                            placeholder="MEM-001 (auto-generated if empty)"
                            value={formData.memberId}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                memberId: e.target.value,
                              })
                            }
                            required={dialogMode === "edit"}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="joinDate">
                            Join Date <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="joinDate"
                            type="date"
                            value={formData.joinDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                joinDate: e.target.value,
                              })
                            }
                            required
                            disabled={isLoading}
                          />
                        </div>
                        {dialogMode === "edit" && (
                          <>
                            <div className="grid gap-2">
                              <Label htmlFor="status">Status</Label>
                              <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    status: value as
                                      | "active"
                                      | "inactive"
                                      | "suspended",
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">
                                    Inactive
                                  </SelectItem>
                                  <SelectItem value="suspended">
                                    Suspended
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="fineAmount">Fine Amount ($)</Label>
                              <Input
                                id="fineAmount"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.fineAmount}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    fineAmount: e.target.value,
                                  })
                                }
                                disabled={isLoading}
                              />
                            </div>
                          </>
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
                      onClick={() => handleDialogClose(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      type="submit"
                      loading={isLoading}
                      loadingText={
                        dialogMode === "edit" ? "Saving..." : "Adding..."
                      }
                    >
                      {dialogMode === "edit"
                        ? "Save Changes"
                        : "Add Borrower"}
                    </LoadingButton>
                  </DialogFooter>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* View Borrower Details Dialog */}
          <Dialog
            open={isViewDialogOpen}
            onOpenChange={handleViewDialogClose}
          >
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border">
              {viewingBorrower && (
                <div className="flex flex-col h-full max-h-[90vh]">
                  <div className="px-6 py-6 border-b border-border">
                    <DialogHeader>
                      <div className="flex items-start gap-4">
                      <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-lg border border-border shadow-sm">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <DialogTitle className="text-xl font-bold leading-tight">
                          {viewingBorrower.name}
                        </DialogTitle>
                        <p className="font-mono text-base text-muted-foreground">
                          {viewingBorrower.memberId}
                        </p>
                        <div className="pt-1">
                          <StatusBadge status={viewingBorrower.status} />
                        </div>
                      </div>
                    </div>
                  </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Contact
                      </h4>
                      <div className="grid gap-4">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{viewingBorrower.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {viewingBorrower.phone || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Membership
                      </h4>
                      <div className="grid gap-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(
                              viewingBorrower.joinDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {viewingBorrower.activeLoans} active /{" "}
                            {viewingBorrower.totalLoans} total loans
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Fines: $
                            {(viewingBorrower.fineAmount || 0).toFixed(2)}
                          </span>
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
                      onClick={() => handleViewDialogClose(false)}
                    >
                      Close
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        viewingBorrower &&
                        handleShareBorrower(viewingBorrower)
                      }
                    >
                      {viewingBorrower &&
                      copiedBorrowerId === viewingBorrower.id ? (
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
                        handleOpenEditDialog(viewingBorrower);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Borrower
                    </Button>
                  </DialogFooter>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent className="sm:max-w-[400px] border-border">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>

              <AlertDialogHeader className="mb-4">
                <AlertDialogTitle className="text-xl font-bold text-center">
                  Delete Borrower
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-sm max-w-xs mx-auto">
                  Are you sure you want to delete this borrower? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {borrowerToDelete && (
                <div className="w-full rounded-lg border border-border bg-muted/50 p-3 mb-6">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded border border-border shadow-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {borrowerToDelete.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {borrowerToDelete.memberId}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <AlertDialogFooter className="grid grid-cols-2 gap-3 w-full">
                <AlertDialogCancel
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setBorrowerToDelete(null);
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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Borrowers
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {borrowerStats.totalBorrowers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All registered members
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Members
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {borrowerStats.activeBorrowers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Suspended
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {borrowerStats.suspendedBorrowers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Fines
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${borrowerStats.totalFines.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Outstanding fines
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find borrowers by name, email, member ID, or phone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, member ID, or phone..."
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
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredBorrowers.length} of {borrowers.length} borrowers
          </div>
        </CardContent>
      </Card>

      {/* Borrowers Display */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>All Borrowers</CardTitle>
          <CardDescription>
            Complete list of library members and borrowers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBorrowers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">
                No borrowers found
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first borrower."}
              </p>
            </div>
          ) : viewMode === "list" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[100px] text-muted-foreground font-semibold uppercase tracking-wider">
                      Member ID
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">
                      Name
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">
                      Contact
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">
                      Join Date
                    </TableHead>
                    <TableHead className="w-[100px] text-muted-foreground font-semibold uppercase tracking-wider">
                      Active Loans
                    </TableHead>
                    <TableHead className="w-[100px] text-muted-foreground font-semibold uppercase tracking-wider">
                      Total Loans
                    </TableHead>
                    <TableHead className="w-[80px] text-muted-foreground font-semibold uppercase tracking-wider">
                      Fines
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
                  {paginatedBorrowers.map((borrower) => (
                    <TableRow
                      key={borrower.id}
                      className="border-border hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => handleOpenViewDialog(borrower)}
                    >
                      <TableCell className="font-mono text-sm font-medium text-foreground">
                        {borrower.memberId}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {borrower.name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {borrower.email}
                          </div>
                          {borrower.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {borrower.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(borrower.joinDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">
                            {borrower.activeLoans}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {borrower.totalLoans}
                      </TableCell>
                      <TableCell className="font-medium">
                        {borrower.fineAmount ? (
                          <span className="text-destructive">
                            ${borrower.fineAmount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">$0.00</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={borrower.status} />
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
                            onClick={() => handleShareBorrower(borrower)}
                            aria-label="Share borrower"
                          >
                            {copiedBorrowerId === borrower.id ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Share2 className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => handleOpenEditDialog(borrower)}
                            aria-label="Edit borrower"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleOpenDeleteDialog(borrower)}
                            aria-label="Delete borrower"
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
              {paginatedBorrowers.map((borrower) => (
                <Card
                  key={borrower.id}
                  className="group border-border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleOpenViewDialog(borrower)}
                >
                  <CardContent className="p-4">
                    <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                      <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground line-clamp-2">
                        {borrower.name}
                      </h3>
                      <p className="font-mono text-sm text-muted-foreground">
                        {borrower.memberId}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {borrower.email}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {borrower.activeLoans} active loans
                        </span>
                        <StatusBadge status={borrower.status} />
                      </div>
                      <div
                        className="flex items-center justify-between pt-2 border-t border-border"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xs text-muted-foreground">
                          ${(borrower.fineAmount || 0).toFixed(2)} fines
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => handleShareBorrower(borrower)}
                            aria-label="Share borrower"
                          >
                            {copiedBorrowerId === borrower.id ? (
                              <Check className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <Share2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={() => handleOpenEditDialog(borrower)}
                            aria-label="Edit borrower"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleOpenDeleteDialog(borrower)}
                            aria-label="Delete borrower"
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
          {filteredBorrowers.length > 0 && (
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
                      {filteredBorrowers.length === 0 ? 0 : startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-foreground">
                      {Math.min(endIndex, filteredBorrowers.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                      {filteredBorrowers.length}
                    </span>{" "}
                    borrowers
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
