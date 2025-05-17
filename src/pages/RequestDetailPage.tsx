
import { useParams, useNavigate, Link } from "react-router-dom";
import { useRequest } from "@/context/RequestContext";
import { AppShell } from "@/components/AppShell";
import { RequestStatusTimeline } from "@/components/RequestStatusTimeline";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RequestStatus } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequestById, getStatusUpdatesForRequest, updateRequestStatus } = useRequest();
  const { user } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(null);
  const [statusComment, setStatusComment] = useState("");

  if (!id) {
    return <div>Invalid request ID</div>;
  }

  const request = getRequestById(id);
  if (!request) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold mb-2">Request Not Found</h1>
          <p className="text-muted-foreground mb-6">The request you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/requests">Back to Requests</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const statusUpdates = getStatusUpdatesForRequest(id);

  // Determine possible next statuses based on current status and user role
  const getNextStatuses = (): { status: RequestStatus; label: string }[] => {
    if (!user) return [];

    const isProductManager = user.role === "product";
    const isSalesRep = user.role === "sales";
    const isAdmin = user.role === "admin";
    
    switch (request.currentStatus) {
      case "submitted":
        if (isProductManager || isAdmin) {
          return [{ status: "under-review", label: "Move to Review" }];
        }
        break;
      case "under-review":
        if (isProductManager || isAdmin) {
          return [
            { status: "accepted", label: "Accept Request" },
            { status: "declined", label: "Decline Request" }
          ];
        }
        break;
      case "accepted":
        if (isProductManager || isAdmin) {
          return [{ status: "planned", label: "Move to Planned" }];
        }
        break;
      case "planned":
        if (isProductManager || isAdmin) {
          return [{ status: "in-development", label: "Move to Development" }];
        }
        break;
      case "in-development":
        if (isProductManager || isAdmin) {
          return [{ status: "released", label: "Mark as Released" }];
        }
        break;
      default:
        return [];
    }
    
    return [];
  };

  const nextStatuses = getNextStatuses();

  const handleStatusUpdate = () => {
    if (selectedStatus && statusComment) {
      updateRequestStatus(id, selectedStatus, statusComment);
      setDialogOpen(false);
      setStatusComment("");
      setSelectedStatus(null);
    }
  };

  const initiateStatusChange = (status: RequestStatus) => {
    setSelectedStatus(status);
    setDialogOpen(true);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/requests")}
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to requests
            </button>
            <h1 className="text-3xl font-bold tracking-tight">{request.title}</h1>
          </div>
          <StatusBadge status={request.currentStatus} className="w-fit" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main request details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>
                  Submitted on {format(new Date(request.creationDate), "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-1">Description</h3>
                  <p className="text-muted-foreground">{request.description}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-1">Business Impact</h3>
                    <p className="text-muted-foreground">{request.businessImpact}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Customer</h3>
                    <p className="text-muted-foreground">{request.customerName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-1">Requested Timeline</h3>
                    <p className="text-muted-foreground">{request.requestedTimeline || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Use Case</h3>
                    <p className="text-muted-foreground">{request.useCase || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Status timeline */}
            <Card>
              <CardContent className="pt-6">
                <RequestStatusTimeline statusUpdates={statusUpdates} />
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request meta information */}
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Requested By</h3>
                  <p>{request.requestedBy.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p>{format(new Date(request.lastUpdatedDate), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <StatusBadge status={request.currentStatus} />
                </div>
              </CardContent>
            </Card>
            
            {/* Actions */}
            {nextStatuses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {nextStatuses.map((statusOption) => (
                    <Button
                      key={statusOption.status}
                      className="w-full"
                      variant={statusOption.status === "declined" ? "destructive" : "default"}
                      onClick={() => initiateStatusChange(statusOption.status)}
                    >
                      {statusOption.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Status change dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Update Status to {selectedStatus && selectedStatus.replace(/-/g, ' ')}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason or comment for this status change.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Enter your comment..."
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={!statusComment}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
