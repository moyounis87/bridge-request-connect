
export type UserRole = 'sales' | 'product' | 'admin';

export type Region = 'north-america' | 'emea' | 'apac' | 'latam';

export type TeamType = 'enterprise' | 'mid-market' | 'smb' | 'product' | 'engineering';

export interface UserTeam {
  id: string;
  name: string;
  type: TeamType;
  region: Region;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId: string;
  team?: UserTeam;
  region: Region;
}

export type RequestCategory = 
  | 'api-integration'
  | 'user-interface'
  | 'reporting'
  | 'security'
  | 'performance'
  | 'compliance'
  | 'other';

export type RequestStatus = 
  | 'submitted'
  | 'under-review'
  | 'accepted'
  | 'declined'
  | 'planned'
  | 'in-development'
  | 'released';

export interface CRMOpportunity {
  id: string;
  name: string;
  value: number;
  stage: string;
  closeDate: string;
  lastUpdatedDate: string;
}

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
  crmLink?: string;
  opportunityId?: string;
  opportunity?: CRMOpportunity;
  category: RequestCategory;
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

export interface Note {
  id: string;
  requestId: string;
  content: string;
  createdById: string;
  createdBy: User;
  creationDate: string;
  type: 'note' | 'transcript';
  sentimentScore?: number;
  dealQualityScore?: number;
}

export interface Metrics {
  totalRequests: number;
  activeRequests: number;
  acceptedRequests: number;
  declinedRequests: number;
  averageResolutionDays: number;
}
