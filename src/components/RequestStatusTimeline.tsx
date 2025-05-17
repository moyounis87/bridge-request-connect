
import { StatusUpdate } from "@/types";
import { format } from "date-fns";
import { StatusBadge } from "./StatusBadge";

interface RequestStatusTimelineProps {
  statusUpdates: StatusUpdate[];
}

export function RequestStatusTimeline({ statusUpdates }: RequestStatusTimelineProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Status History</h3>
      <div className="space-y-4">
        {statusUpdates.map((update, index) => (
          <div key={update.id} className="relative pl-6 pb-4">
            {/* Timeline connector */}
            {index < statusUpdates.length - 1 && (
              <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-border"></div>
            )}
            
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-primary"></div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StatusBadge status={update.newStatus} />
                <span className="text-sm text-muted-foreground">
                  {format(new Date(update.updateDate), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <p className="text-sm">{update.comment}</p>
              <p className="text-xs text-muted-foreground">By {update.updatedBy.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
