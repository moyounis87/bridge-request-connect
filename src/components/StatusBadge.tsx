
import { RequestStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const displayText = status.replace(/-/g, ' ');
  
  // Get variant and color based on status
  const getVariant = () => {
    switch (status) {
      case 'submitted':
        return 'outline';
      case 'under-review':
        return 'secondary';
      case 'accepted':
        return 'success';
      case 'declined':
        return 'destructive';
      case 'planned':
        return 'default';
      case 'in-development':
        return 'warning';
      case 'released':
        return 'success';
      default:
        return 'default';
    }
  };
  
  return (
    <Badge 
      variant={getVariant()} 
      className={cn("capitalize", className)}
    >
      {displayText}
    </Badge>
  );
}
