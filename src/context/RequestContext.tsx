
import { createContext, useContext, useState, ReactNode } from "react";
import { Request, RequestStatus, StatusUpdate } from "../types";
import { requests as initialRequests, statusUpdates as initialStatusUpdates } from "../data/mockData";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

interface RequestContextType {
  requests: Request[];
  statusUpdates: StatusUpdate[];
  createRequest: (request: Omit<Request, "id" | "creationDate" | "lastUpdatedDate" | "currentStatus" | "requestedBy">) => void;
  updateRequestStatus: (requestId: string, newStatus: RequestStatus, comment: string) => void;
  getRequestById: (id: string) => Request | undefined;
  getStatusUpdatesForRequest: (requestId: string) => StatusUpdate[];
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>(initialStatusUpdates);
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

  return (
    <RequestContext.Provider
      value={{
        requests,
        statusUpdates,
        createRequest,
        updateRequestStatus,
        getRequestById,
        getStatusUpdatesForRequest,
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
