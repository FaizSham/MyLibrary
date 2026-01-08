"use client";

import { useState } from "react";
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
import { mockBorrowers, borrowerStats } from "@/data/mock-borrowers";
import type { Borrower } from "@/data/mock-borrowers";

export default function BorrowersPage() {
  const [borrowers, setBorrowers] = useState<Borrower[]>(mockBorrowers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    memberId: "",
  });

  const handleAddBorrower = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newBorrower: Borrower = {
        id: String(borrowers.length + 1),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        memberId: formData.memberId || `MEM-${String(borrowers.length + 1).padStart(3, "0")}`,
        joinDate: new Date().toISOString().split("T")[0],
        activeLoans: 0,
        totalLoans: 0,
        status: "active",
      };
      setBorrowers([newBorrower, ...borrowers]);
      setFormData({ name: "", email: "", phone: "", memberId: "" });
      setIsDialogOpen(false);
      toast.success("Borrower added successfully", {
        description: `${newBorrower.name} has been added to your library system.`,
      });
    } catch {
      toast.error("Failed to add borrower", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBorrowers = borrowers.filter(
    (borrower) =>
      borrower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      borrower.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      borrower.memberId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Borrower
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border">
            <form onSubmit={handleAddBorrower}>
              <DialogHeader>
                <DialogTitle>Add New Borrower</DialogTitle>
                <DialogDescription>
                  Enter the borrower details to add them to your library system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
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
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="memberId">Member ID (Optional)</Label>
                  <Input
                    id="memberId"
                    placeholder="MEM-001"
                    value={formData.memberId}
                    onChange={(e) =>
                      setFormData({ ...formData, memberId: e.target.value })
                    }
                    disabled={isLoading}
                  />
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
                <LoadingButton type="submit" loading={isLoading} loadingText="Adding...">
                  Add Borrower
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Borrowers</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{borrowerStats.totalBorrowers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All registered members
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{borrowerStats.activeBorrowers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Suspended</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{borrowerStats.suspendedBorrowers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Fines</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${borrowerStats.totalFines.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Outstanding fines
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="border-border shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, or member ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Borrowers Table */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>All Borrowers</CardTitle>
          <CardDescription>
            A list of all library members and borrowers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBorrowers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No borrowers found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery
                  ? "Try adjusting your search criteria."
                  : "Get started by adding your first borrower."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">Member ID</TableHead>
                  <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">Name</TableHead>
                  <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">Contact</TableHead>
                  <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">Join Date</TableHead>
                  <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">Active Loans</TableHead>
                  <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">Total Loans</TableHead>
                  <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider">Fines</TableHead>
                  <TableHead className="text-right text-muted-foreground font-semibold uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBorrowers.map((borrower) => (
                  <TableRow key={borrower.id} className="border-border hover:bg-accent transition-colors">
                    <TableCell className="font-mono text-sm font-medium text-foreground">{borrower.memberId}</TableCell>
                    <TableCell className="font-medium text-foreground">{borrower.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {borrower.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {borrower.phone}
                        </div>
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
                        <span className="font-medium text-foreground">{borrower.activeLoans}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{borrower.totalLoans}</TableCell>
                    <TableCell className="font-medium">
                      {borrower.fineAmount ? (
                        <span className="text-destructive">${borrower.fineAmount.toFixed(2)}</span>
                      ) : (
                        <span className="text-muted-foreground">$0.00</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={borrower.status} />
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

