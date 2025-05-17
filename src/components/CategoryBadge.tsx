
import { RequestCategory } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Folders } from "lucide-react";

interface CategoryBadgeProps {
  category: RequestCategory;
  className?: string;
  showIcon?: boolean;
}

export function CategoryBadge({ category, className, showIcon = false }: CategoryBadgeProps) {
  const displayText = category.replace(/-/g, ' ');
  
  // Get variant and color based on category
  const getVariant = () => {
    switch (category) {
      case 'api-integration':
        return 'default';
      case 'user-interface':
        return 'secondary';
      case 'reporting':
        return 'outline';
      case 'security':
        return 'destructive';
      case 'performance':
        return 'success';
      case 'compliance':
        return 'warning';
      default:
        return 'outline';
    }
  };
  
  return (
    <Badge 
      variant={getVariant()} 
      className={cn("capitalize", className)}
    >
      {showIcon && <Folders className="mr-1 h-3 w-3" />}
      {displayText}
    </Badge>
  );
}
