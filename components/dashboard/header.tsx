"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export function Header() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  
  // Helper to format segment names (e.g., "new-books" -> "New Books")
  const formatSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-stone-200 bg-white/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden -ml-2 text-stone-500 hover:text-stone-900">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <Sidebar mobile />
            </SheetContent>
          </Sheet>

           {/* Breadcrumbs */}
           <nav className="hidden sm:flex items-center text-sm font-medium text-stone-500">
            <Link 
              href="/dashboard" 
              className="flex items-center hover:text-stone-900 transition-colors"
            >
              <Home className="h-4 w-4" />
            </Link>
            {segments.map((segment, index) => {
              // Skip "dashboard" as it's the home icon
              if (segment === "dashboard" && index === 0) return null;

              const href = `/${segments.slice(0, index + 1).join("/")}`;
              const isLast = index === segments.length - 1;

              return (
                <div key={href} className="flex items-center">
                  <ChevronRight className="h-4 w-4 mx-2 text-stone-400" />
                  {isLast ? (
                    <span className="text-stone-900 font-semibold">
                      {formatSegment(segment)}
                    </span>
                  ) : (
                    <Link 
                      href={href}
                      className="hover:text-stone-900 transition-colors"
                    >
                      {formatSegment(segment)}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
            <Button variant="ghost" size="icon" className="relative text-stone-600 hover:text-stone-900">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="sr-only">View notifications</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-stone-200" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-stone-900">John Doe</p>
                    <p className="text-xs leading-none text-stone-500">
                      john.doe@bukugo.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-stone-200" />
                <DropdownMenuItem className="text-stone-700 hover:bg-stone-100">Profile</DropdownMenuItem>
                <DropdownMenuItem className="text-stone-700 hover:bg-stone-100">Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-stone-200" />
                <DropdownMenuItem className="text-stone-700 hover:bg-stone-100">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
    </>
  );
}

