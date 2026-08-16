export type Language = 'en' | 'hi' | 'mr' | 'hinglish';

export type UserRole = 'citizen' | 'officer' | 'admin';

export type CaseStatus = 
  | 'Submitted' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Waiting for Citizen' 
  | 'Resolved' 
  | 'Reopened' 
  | 'Escalated' 
  | 'Closed';

export type PriorityLevel = 'Low' | 'Normal' | 'Elevated' | 'High' | 'Critical';

export type SlaStatus = 'On Track' | 'Warning' | 'Overdue' | 'Escalated' | 'Pending Review';

export type Department = 
  | 'Solid Waste Management' 
  | 'Roads & Traffic' 
  | 'Water Works' 
  | 'Electrical & Streetlights' 
  | 'Drainage & Sewage' 
  | 'Public Health & Sanitation' 
  | 'Enforcement & Hoardings' 
  | 'Town Planning & Birth/Death';

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
  actor?: string;
  status: 'completed' | 'current' | 'pending';
  dotColor?: 'dark' | 'orange' | 'green' | 'gray';
  evidenceUrl?: string;
}

export interface CaseAttachment {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'document';
  size?: string;
}

export interface CaseItem {
  id: string; // e.g. "NS-2024-8842" or "REQ-2024-892"
  title: string;
  description: string;
  category: string;
  department: Department;
  location: string;
  ward: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  citizenName: string;
  citizenPhone: string;
  citizenId: string;
  status: CaseStatus;
  priority: PriorityLevel;
  slaStatus: SlaStatus;
  slaRemaining?: string;
  expectedResolutionDays?: number;
  createdAt: string;
  updatedAt: string;
  assignedOfficer?: string;
  assignedOfficerPhone?: string;
  attachments: CaseAttachment[];
  timeline: TimelineEvent[];
  communityIssueId?: string;
  duplicateCount?: number;
  resolutionNotes?: string;
  resolutionEvidenceUrl?: string;
  citizenFeedback?: {
    isResolved: boolean;
    feedbackText?: string;
    submittedAt?: string;
  };
  language?: Language;
  rawUserInput?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  language?: Language;
  widgetType?: 'location_picker' | 'photo_upload' | 'case_summary' | 'duplicate_warning' | 'categories';
  meta?: {
    caseId?: string;
    extractedCategory?: string;
    extractedLocation?: string;
    photoUrl?: string;
    possibleDuplicateId?: string;
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'case_update' | 'sla_warning' | 'officer_assigned' | 'resolved' | 'community_alert' | 'system';
  caseId?: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface HotspotCluster {
  id: string;
  name: string;
  ward: string;
  category: string;
  count: number;
  lat: number;
  lng: number;
  severity: 'low' | 'moderate' | 'high';
  description: string;
  recentCases: string[];
}

export interface CommunityInsight {
  id: string;
  title: string;
  description: string;
  type: 'road' | 'water' | 'waste' | 'electricity';
  reportCount: number;
  ward: string;
  status: string;
  actionLabel?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  preferredLanguage: Language;
  homeAddress: string;
  officeAddress?: string;
  ward: string;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    voiceAssistance: boolean;
    screenReaderOptimized: boolean;
  };
  notificationsEnabled: boolean;
}

export interface MunicipalService {
  id: string;
  name: string;
  department: Department;
  description: string;
  fee: number;
  slaDays: number;
  requiredDocuments: string[];
  icon: string;
}
