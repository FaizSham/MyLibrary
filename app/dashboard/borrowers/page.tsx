"use client";

import { useState } from "react";
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
import { mockBorrowers, borrowerStats } from "@/data/mock-borrowers";
import type { Borrower } from "@/data/mock-borrowers";

export default function BorrowersPage() {
  const [borrowers, setBorrowers] = useState<Borrower[]>(mockBorrowers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    memberId: "",
  });

  const handleAddBorrower = (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const getStatusBadge = (status: Borrower["status"]) => {
    const variants = {
      active: { variant: "default" as const, className: "bg-green-50 text-green-700 border-green-200" },
      inactive: { variant: "secondary" as const, className: "bg-stone-50 text-stone-700 border-stone-200" },
      suspended: { variant: "destructive" as const, className: "bg-red-50 text-red-700 border-red-200" },
    } as const;

    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Borrowers
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Manage library members and borrowers
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm">
              <Plus className="h-4 w-4" />
              Add New Borrower
            </Button>
          </DialogTrigger>
          <DialogContent className="border-stone-200">
            <form onSubmit={handleAddBorrower}>
              <DialogHeader>
                <DialogTitle className="text-stone-900">Add New Borrower</DialogTitle>
                <DialogDescription className="text-stone-600">
                  Enter the borrower details to add them to your library system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-stone-700">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-stone-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-stone-700">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="memberId" className="text-stone-700">Member ID (Optional)</Label>
                  <Input
                    id="memberId"
                    placeholder="MEM-001"
                    value={formData.memberId}
                    onChange={(e) =>
                      setFormData({ ...formData, memberId: e.target.value })
                    }
                    className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
                  />
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
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                  Add Borrower
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-stone-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Total Borrowers</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900">{borrowerStats.totalBorrowers.toLocaleString()}</div>
            <p className="text-xs text-stone-500 mt-1">
              All registered members
            </p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Active Members</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900">{borrowerStats.activeBorrowers}</div>
            <p className="text-xs text-stone-500 mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Suspended</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{borrowerStats.suspendedBorrowers}</div>
            <p className="text-xs text-stone-500 mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Total Fines</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900">${borrowerStats.totalFines.toFixed(2)}</div>
            <p className="text-xs text-stone-500 mt-1">
              Outstanding fines
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <Input
              type="search"
              placeholder="Search by name, email, or member ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-stone-200 bg-white pl-10 text-stone-900 placeholder:text-stone-500 focus:border-indigo-300 focus:ring-indigo-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Borrowers Table */}
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-stone-900">All Borrowers</CardTitle>
          <CardDescription className="text-stone-600">
            A list of all library members and borrowers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-stone-200 hover:bg-transparent">
                <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">Member ID</TableHead>
                <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">Contact</TableHead>
                <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">Join Date</TableHead>
                <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">Active Loans</TableHead>
                <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">Total Loans</TableHead>
                <TableHead className="text-stone-500 font-semibold uppercase tracking-wider">Fines</TableHead>
                <TableHead className="text-right text-stone-500 font-semibold uppercase tracking-wider">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBorrowers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-stone-500">
                    No borrowers found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBorrowers.map((borrower) => (
                  <TableRow key={borrower.id} className="border-stone-200 hover:bg-stone-50 transition-colors">
                    <TableCell className="font-mono text-sm font-medium text-stone-900">{borrower.memberId}</TableCell>
                    <TableCell className="font-medium text-stone-900">{borrower.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                          <Mail className="h-3 w-3" />
                          {borrower.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-stone-500">
                          <Phone className="h-3 w-3" />
                          {borrower.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-stone-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(borrower.joinDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                        <span className="font-medium text-stone-900">{borrower.activeLoans}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-stone-600">{borrower.totalLoans}</TableCell>
                    <TableCell className="font-medium">
                      {borrower.fineAmount ? (
                        <span className="text-red-600">${borrower.fineAmount.toFixed(2)}</span>
                      ) : (
                        <span className="text-stone-400">$0.00</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {getStatusBadge(borrower.status)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

