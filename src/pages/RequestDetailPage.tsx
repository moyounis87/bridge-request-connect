
import { useParams, useNavigate, Link } from "react-router-dom";
import { useRequest } from "@/context/RequestContext";
import { AppShell } from "@/components/AppShell";
import { RequestStatusTimeline } from "@/components/RequestStatusTimeline";
import { StatusBadge } from "@/components/StatusBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RequestStatus, Note } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { useState } from "react";
import { ArrowLeft, ExternalLink, Link as LinkIcon, MessageSquare, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { NoteItem } from "@/components/NoteItem";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequestById, getStatusUpdatesForRequest, updateRequestStatus, addNote, getNotesForRequest, updateOpportunityDetails } = useRequest();
  const { user } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(null);
  const [statusComment, setStatusComment] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteType, setNoteType] = useState<"note" | "transcript">("note");
  const [noteContent, setNoteContent] = useState("");
  const [opportunityDialogOpen, setOpportunityDialogOpen] = useState(false);
  const [opportunityData, setOpportunityData] = useState({
    value: 0,
    stage: "",
    closeDate: format(new Date(), "yyyy-MM-dd")
  });

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
  const notes = getNotesForRequest(id);

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

  const handleAddNote = () => {
    if (noteContent && user) {
      addNote({
        requestId: id,
        content: noteContent,
        type: noteType,
        createdById: user.id  // Add the missing createdById property
      });
      setNoteDialogOpen(false);
      setNoteContent("");
      // Switch to notes tab after adding
      setActiveTab("notes");
    }
  };

  const handleUpdateOpportunity = () => {
    if (opportunityData.value && opportunityData.stage && opportunityData.closeDate) {
      updateOpportunityDetails(
        id, 
        opportunityData.value, 
        opportunityData.stage,
        opportunityData.closeDate
      );
      setOpportunityDialogOpen(false);
    }
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
            <div className="flex flex-wrap gap-2 mt-2">
              <StatusBadge status={request.currentStatus} />
              <CategoryBadge category={request.category || 'other'} />
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes">
              Notes & Transcripts
              {notes.length > 0 && <span className="ml-1 text-xs bg-primary/20 rounded-full px-2">{notes.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
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
                    {request.crmLink && (
                      <div>
                        <h3 className="font-medium mb-1">CRM Opportunity</h3>
                        <div className="flex items-center text-primary hover:underline">
                          <LinkIcon className="h-4 w-4 mr-1" />
                          <a href={request.crmLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            View in CRM
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* CRM Opportunity details if available */}
                {request.opportunity && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>CRM Opportunity Details</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setOpportunityData({
                              value: request.opportunity?.value || 0,
                              stage: request.opportunity?.stage || "",
                              closeDate: request.opportunity?.closeDate || format(new Date(), "yyyy-MM-dd")
                            });
                            setOpportunityDialogOpen(true);
                          }}
                        >
                          Update
                        </Button>
                      </div>
                      <CardDescription>
                        Last updated: {format(new Date(request.opportunity.lastUpdatedDate), "MMMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Deal Value</h3>
                          <p className="font-medium">${request.opportunity.value.toLocaleString()}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Stage</h3>
                          <p>{request.opportunity.stage}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Close Date</h3>
                          <p>{format(new Date(request.opportunity.closeDate), "MMM d, yyyy")}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
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
                      <h3 className="text-sm font-medium text-muted-foreground">Team</h3>
                      <p>{request.requestedBy.team?.name || "Unassigned"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Region</h3>
                      <p className="capitalize">{request.requestedBy.region?.replace(/-/g, ' ') || "Global"}</p>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setNoteType("note");
                        setNoteDialogOpen(true);
                      }}
                    >
                      Add Note
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setNoteType("transcript");
                        setNoteDialogOpen(true);
                      }}
                    >
                      Add Call Transcript
                    </Button>
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
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Notes & Transcripts</h2>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setNoteType("note");
                    setNoteDialogOpen(true);
                  }}
                >
                  Add Note
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setNoteType("transcript");
                    setNoteDialogOpen(true);
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Transcript
                </Button>
              </div>
            </div>
            
            {notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note) => (
                  <NoteItem key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="mb-4 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No notes or transcripts yet</h3>
                  <p className="text-muted-foreground mb-4">Add notes or call transcripts to provide additional context.</p>
                  <div className="space-x-2">
                    <Button
                      onClick={() => {
                        setNoteType("note");
                        setNoteDialogOpen(true);
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add First Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Status History</CardTitle>
              </CardHeader>
              <CardContent>
                <RequestStatusTimeline statusUpdates={statusUpdates} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

      {/* Note/Transcript dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {noteType === "note" ? "Add Note" : "Add Call Transcript"}
            </DialogTitle>
            <DialogDescription>
              {noteType === "note" 
                ? "Add a note with additional context for this feature request." 
                : "Add a call transcript to analyze customer sentiment and deal quality."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="noteContent">
                {noteType === "note" ? "Note Content" : "Call Transcript"}
              </Label>
              <Textarea
                id="noteContent"
                placeholder={noteType === "note" 
                  ? "Enter your note..." 
                  : "Paste the call transcript here..."
                }
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={8}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={!noteContent}>
              Save {noteType === "note" ? "Note" : "Transcript"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Opportunity Update Dialog */}
      <Dialog open={opportunityDialogOpen} onOpenChange={setOpportunityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Opportunity Details</DialogTitle>
            <DialogDescription>
              Update the deal information from your CRM.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="opportunityValue">Deal Value ($)</Label>
              <Input
                id="opportunityValue"
                type="number"
                placeholder="100000"
                value={opportunityData.value}
                onChange={(e) => setOpportunityData({
                  ...opportunityData,
                  value: parseInt(e.target.value) || 0
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="opportunityStage">Deal Stage</Label>
              <Input
                id="opportunityStage"
                placeholder="e.g. Qualified, Discovery, Proposal"
                value={opportunityData.stage}
                onChange={(e) => setOpportunityData({
                  ...opportunityData,
                  stage: e.target.value
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="opportunityCloseDate">Expected Close Date</Label>
              <Input
                id="opportunityCloseDate"
                type="date"
                value={opportunityData.closeDate}
                onChange={(e) => setOpportunityData({
                  ...opportunityData,
                  closeDate: e.target.value
                })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpportunityDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateOpportunity} 
              disabled={!opportunityData.value || !opportunityData.stage || !opportunityData.closeDate}
            >
              Update Opportunity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
