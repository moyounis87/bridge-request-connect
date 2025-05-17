
import { createContext, useContext, useState, ReactNode } from "react";
import { Request, RequestStatus, StatusUpdate, Note, RequestCategory } from "../types";
import { requests as initialRequests, statusUpdates as initialStatusUpdates } from "../data/mockData";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

interface RequestContextType {
  requests: Request[];
  statusUpdates: StatusUpdate[];
  notes: Note[];
  createRequest: (request: Omit<Request, "id" | "creationDate" | "lastUpdatedDate" | "currentStatus" | "requestedBy">) => void;
  updateRequestStatus: (requestId: string, newStatus: RequestStatus, comment: string) => void;
  getRequestById: (id: string) => Request | undefined;
  getStatusUpdatesForRequest: (requestId: string) => StatusUpdate[];
  addNote: (note: Omit<Note, "id" | "creationDate" | "createdBy">) => void;
  getNotesForRequest: (requestId: string) => Note[];
  updateOpportunityDetails: (requestId: string, value: number, stage: string, closeDate: string) => void;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>(initialRequests.map(req => ({ ...req, category: req.category || 'other' })));
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>(initialStatusUpdates);
  const [notes, setNotes] = useState<Note[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const createRequest = (requestData: Omit<Request, "id" | "creationDate" | "lastUpdatedDate" | "currentStatus" | "requestedBy">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a request.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
    const newRequest: Request = {
      id: `r${requests.length + 1}`,
      ...requestData,
      requestedBy: user,
      creationDate: now,
      lastUpdatedDate: now,
      currentStatus: "submitted",
    };

    setRequests([...requests, newRequest]);

    const newStatusUpdate: StatusUpdate = {
      id: `su${statusUpdates.length + 1}`,
      requestId: newRequest.id,
      newStatus: "submitted",
      updatedById: user.id,
      updatedBy: user,
      updateDate: now,
      comment: `Initial submission: ${newRequest.title}`,
    };

    setStatusUpdates([...statusUpdates, newStatusUpdate]);

    toast({
      title: "Request created",
      description: "Your feature request has been submitted successfully.",
    });
  };

  const updateRequestStatus = (requestId: string, newStatus: RequestStatus, comment: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update a request status.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
    setRequests(
      requests.map((request) => {
        if (request.id === requestId) {
          return {
            ...request,
            currentStatus: newStatus,
            lastUpdatedDate: now,
          };
        }
        return request;
      })
    );

    const newStatusUpdate: StatusUpdate = {
      id: `su${statusUpdates.length + 1}`,
      requestId,
      newStatus,
      updatedById: user.id,
      updatedBy: user,
      updateDate: now,
      comment,
    };

    setStatusUpdates([...statusUpdates, newStatusUpdate]);

    toast({
      title: "Status updated",
      description: `Request status updated to ${newStatus.replace('-', ' ')}.`,
    });
  };

  const getRequestById = (id: string) => {
    return requests.find((request) => request.id === id);
  };

  const getStatusUpdatesForRequest = (requestId: string) => {
    return statusUpdates
      .filter((update) => update.requestId === requestId)
      .sort((a, b) => new Date(a.updateDate).getTime() - new Date(b.updateDate).getTime());
  };

  const addNote = (noteData: Omit<Note, "id" | "creationDate" | "createdBy">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add notes.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
    const newNote: Note = {
      id: `n${notes.length + 1}`,
      ...noteData,
      createdById: user.id,
      createdBy: user,
      creationDate: now,
    };

    // For transcripts, calculate a mock sentiment/quality score
    if (noteData.type === 'transcript') {
      // Simple algorithm: length-based score between 0-100
      const contentLength = noteData.content.length;
      newNote.sentimentScore = Math.min(Math.floor(contentLength / 20), 100);
      newNote.dealQualityScore = Math.min(Math.floor(contentLength / 15), 100);
    }

    setNotes([...notes, newNote]);

    toast({
      title: `${noteData.type === 'note' ? 'Note' : 'Transcript'} added`,
      description: `Your ${noteData.type} has been added to the request.`,
    });
  };

  const getNotesForRequest = (requestId: string) => {
    return notes
      .filter((note) => note.requestId === requestId)
      .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
  };

  const updateOpportunityDetails = (requestId: string, value: number, stage: string, closeDate: string) => {
    setRequests(
      requests.map((request) => {
        if (request.id === requestId && request.opportunityId) {
          const now = new Date().toISOString();
          return {
            ...request,
            opportunity: {
              ...(request.opportunity || { id: request.opportunityId, name: request.customerName }),
              value,
              stage,
              closeDate,
              lastUpdatedDate: now,
            },
            lastUpdatedDate: now,
          };
        }
        return request;
      })
    );

    toast({
      title: "Opportunity updated",
      description: `CRM opportunity details have been updated.`,
    });
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        statusUpdates,
        notes,
        createRequest,
        updateRequestStatus,
        getRequestById,
        getStatusUpdatesForRequest,
        addNote,
        getNotesForRequest,
        updateOpportunityDetails
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequest() {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error("useRequest must be used within a RequestProvider");
  }
  return context;
}
