
export type UserRole = 'sales' | 'product' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId: string;
}

export type RequestStatus = 
  | 'submitted'
  | 'under-review'
  | 'accepted'
  | 'declined'
  | 'planned'
  | 'in-development'
  | 'released';

export interface Request {
  id: string;
  title: string;
  description: string;
  businessImpact: string;
  customerName: string;
  requestedById: string;
  requestedBy: User;
  currentStatus: RequestStatus;
  creationDate: string;
  lastUpdatedDate: string;
  requestedTimeline?: string;
  useCase?: string;
}

export interface StatusUpdate {
  id: string;
  requestId: string;
  newStatus: RequestStatus;
  updatedById: string;
  updatedBy: User;
  updateDate: string;
  comment: string;
}

export interface Attachment {
  id: string;
  requestId: string;
  fileName: string;
  fileType: string;
  uploadedById: string;
  uploadedBy: User;
  uploadDate: string;
}

export interface Metrics {
  totalRequests: number;
  activeRequests: number;
  acceptedRequests: number;
  declinedRequests: number;
  averageResolutionDays: number;
}
