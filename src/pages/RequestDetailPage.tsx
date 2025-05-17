
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRequest } from "@/context/RequestContext";
import { useAuth } from "@/context/AuthContext";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  ListChecks,
  MessageSquare,
  FileText,
  ClipboardList,
  DollarSign,
  Calendar,
  Link as LucideLink,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { RevenuePredictionCard } from "@/components/RevenuePredictionCard";

import { RequestStatus } from "@/types";

export default function RequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const { getRequestById, getStatusUpdatesForRequest, updateRequestStatus, addNote, getNotesForRequest, updateOpportunityDetails } = useRequest();
  const { user } = useAuth();
  const { toast } = useToast();

  const [request, setRequest] = useState(getRequestById(requestId || ""));
  const [statusUpdates, setStatusUpdates] = useState(getStatusUpdatesForRequest(requestId || ""));
  const [notes, setNotes] = useState(getNotesForRequest(requestId || ""));

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<RequestStatus>(request?.currentStatus || "submitted");
  const [statusComment, setStatusComment] = useState("");

  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState<'note' | 'transcript'>('note');

  const [isOpportunityDialogOpen, setIsOpportunityDialogOpen] = useState(false);
  const [opportunityValue, setOpportunityValue] = useState(0);
  const [opportunityStage, setOpportunityStage] = useState("");
  const [opportunityCloseDate, setOpportunityCloseDate] = useState("");

  useEffect(() => {
    if (requestId) {
      const req = getRequestById(requestId);
      setRequest(req);

      const updates = getStatusUpdatesForRequest(requestId);
      setStatusUpdates(updates);

      const notesForRequest = getNotesForRequest(requestId);
      setNotes(notesForRequest);
    }
  }, [requestId, getRequestById, getStatusUpdatesForRequest, getNotesForRequest]);

  const handleStatusUpdate = () => {
    if (!newStatus || !statusComment) {
      toast({
        title: "Error",
        description: "Please select a status and provide a comment.",
        variant: "destructive",
      });
      return;
    }

    if (requestId) {
      updateRequestStatus(requestId, newStatus, statusComment);
      setIsStatusDialogOpen(false);
      setStatusComment("");
    }
  };

  const handleAddNote = () => {
    if (!noteContent) {
      toast({
        title: "Error",
        description: "Please provide note content.",
        variant: "destructive",
      });
      return;
    }

    if (requestId && user) {
      addNote({
        requestId,
        content: noteContent,
        type: noteType,
        createdById: user.id, // Add the missing createdById property
      });
      setIsNoteDialogOpen(false);
      setNoteContent("");
    }
  };

  const handleOpportunityUpdate = () => {
    if (!opportunityValue || !opportunityStage || !opportunityCloseDate) {
      toast({
        title: "Error",
        description: "Please fill all opportunity details.",
        variant: "destructive",
      });
      return;
    }

    if (requestId) {
      updateOpportunityDetails(requestId, opportunityValue, opportunityStage, opportunityCloseDate);
      setIsOpportunityDialogOpen(false);
    }
  };

  if (!request) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Request not found</h1>
            <p className="text-muted-foreground mt-2">
              The request you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button asChild className="mt-4">
              <Link to="/requests">Go to Requests</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">{request.title}</h1>
            <p className="text-muted-foreground">
              Created on {format(new Date(request.creationDate), "MMM d, yyyy")} by {request.requestedBy.name}
            </p>
          </div>
          <Badge variant="secondary">{request.currentStatus.replace('-', ' ')}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Main content section */}
            
            {/* Description Card */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
                <CardDescription>Details about the feature request</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{request.description}</p>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground">
                  <strong>Business Impact:</strong> {request.businessImpact}
                </p>
                {request.useCase && (
                  <>
                    <Separator className="my-4" />
                    <p className="text-sm text-muted-foreground">
                      <strong>Use Case:</strong> {request.useCase}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
                <CardDescription>Updates on the progress of this request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusUpdates.map((update) => (
                    <div key={update.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <ListChecks className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{update.newStatus.replace('-', ' ')}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(update.updateDate), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.comment}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Updated by {update.updatedBy.name}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Notes Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Notes & Transcripts</CardTitle>
                  <Button size="sm" onClick={() => setIsNoteDialogOpen(true)}>Add Note</Button>
                </div>
                <CardDescription>Internal notes and call transcripts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {note.type === 'transcript' ? (
                            <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                          ) : (
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          )}
                          <span className="font-medium">{note.type === 'transcript' ? 'Call Transcript' : 'Note'}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(note.creationDate), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap text-muted-foreground">{note.content}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Created by {note.createdBy.name}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Sidebar section */}
            
            {/* Request Meta Card */}
            <Card>
              <CardHeader>
                <CardTitle>Request Meta</CardTitle>
                <CardDescription>Details about the request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span>Category: {request.category}</span>
                </div>
                {request.requestedTimeline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Timeline: {request.requestedTimeline}</span>
                  </div>
                )}
                {request.crmLink && (
                  <div className="flex items-center gap-2">
                    <LucideLink className="h-4 w-4 text-muted-foreground" />
                    <a href={request.crmLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                      CRM Opportunity
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Revenue Prediction Card - New addition */}
            {request.revenuePrediction && (
              <RevenuePredictionCard prediction={request.revenuePrediction} />
            )}
            
            {/* CRM Opportunity Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>CRM Opportunity</CardTitle>
                  <Button size="sm" onClick={() => setIsOpportunityDialogOpen(true)}>
                    Update Details
                  </Button>
                </div>
                <CardDescription>Details from the CRM</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {request.opportunity ? (
                  <>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Value: ${request.opportunity.value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <span>Stage: {request.opportunity.stage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Close Date: {format(new Date(request.opportunity.closeDate), "MMM d, yyyy")}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No opportunity linked.</p>
                )}
              </CardContent>
            </Card>
            
            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Take action on this request</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">Update Status</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Update Request Status</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to update the status of this request?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Status
                        </Label>
                        <Select value={newStatus} onValueChange={(value) => setNewStatus(value as RequestStatus)} >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="under-review">Under Review</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in-development">In Development</SelectItem>
                            <SelectItem value="released">Released</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="comment" className="text-right">
                          Comment
                        </Label>
                        <Textarea id="comment" className="col-span-3" value={statusComment} onChange={(e) => setStatusComment(e.target.value)} />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleStatusUpdate}>Update</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Dialogs */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Request Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the status of this request?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as RequestStatus)} >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-development">In Development</SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comment" className="text-right">
                Comment
              </Label>
              <Textarea id="comment" className="col-span-3" value={statusComment} onChange={(e) => setStatusComment(e.target.value)} />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusUpdate}>Update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Note</AlertDialogTitle>
            <AlertDialogDescription>
              Add a note or call transcript to this request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="noteType" className="text-right">
                Type
              </Label>
              <Select value={noteType} onValueChange={(value) => setNoteType(value as 'note' | 'transcript')}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="transcript">Transcript</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea id="content" className="col-span-3" value={noteContent} onChange={(e) => setNoteContent(e.target.value)} />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddNote}>Add Note</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpportunityDialogOpen} onOpenChange={setIsOpportunityDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Opportunity Details</AlertDialogTitle>
            <AlertDialogDescription>
              Update the CRM opportunity details for this request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              <Input type="number" id="value" className="col-span-3" value={opportunityValue} onChange={(e) => setOpportunityValue(Number(e.target.value))} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stage" className="text-right">
                Stage
              </Label>
              <Input type="text" id="stage" className="col-span-3" value={opportunityStage} onChange={(e) => setOpportunityStage(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="closeDate" className="text-right">
                Close Date
              </Label>
              <Input type="date" id="closeDate" className="col-span-3" value={opportunityCloseDate} onChange={(e) => setOpportunityCloseDate(e.target.value)} />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleOpportunityUpdate}>Update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
