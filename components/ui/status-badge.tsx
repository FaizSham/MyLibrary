import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BookStatus = "available" | "loaned" | "overdue";
type BorrowerStatus = "active" | "inactive" | "suspended";
type Status = BookStatus | BorrowerStatus;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { variant: "default" | "secondary" | "destructive"; className: string }> = {
  // Book statuses
  available: {
    variant: "default",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  loaned: {
    variant: "secondary",
    className: "bg-secondary text-secondary-foreground",
  },
  overdue: {
    variant: "destructive",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  // Borrower statuses
  active: {
    variant: "default",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  inactive: {
    variant: "secondary",
    className: "bg-muted text-muted-foreground",
  },
  suspended: {
    variant: "destructive",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const displayText = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {displayText}
    </Badge>
  );
}

