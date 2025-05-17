
import { RequestStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const displayText = status.replace(/-/g, ' ');
  
  return (
    <Badge className={cn(`status-badge-${status}`, className)}>
      {displayText.charAt(0).toUpperCase() + displayText.slice(1)}
    </Badge>
  );
}
