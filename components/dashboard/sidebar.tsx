"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  Library,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Books", href: "/dashboard/books", icon: BookOpen },
  { name: "Borrowers", href: "/dashboard/borrowers", icon: Users },
  { name: "Loans", href: "/dashboard/loans", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ 
  mobile = false, 
  onNavigate 
}: { 
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (mobile && onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className={mobile ? "flex flex-col h-full" : "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"}>
      <div className={`flex grow flex-col gap-y-5 overflow-y-auto bg-muted px-6 pb-4 ${mobile ? "" : "border-r border-border"}`}>
        <div className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Library className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">BukuGo</span>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  // For dashboard, match exactly. For other routes, match if pathname starts with href
                  const isActive = item.href === "/dashboard" 
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          "group flex gap-x-3 rounded-lg p-2 text-sm leading-6 font-semibold transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-6 w-6 shrink-0",
                            isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

