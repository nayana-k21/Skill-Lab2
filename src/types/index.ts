export type SupportedLanguage = 'en' | 'hi' | 'kn';

export type PriorityLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type ReviewStatus =
  | 'Awaiting Review'
  | 'Reviewed'
  | 'Follow-up Requested'
  | 'AI Assessment Dismissed';

export type ReferralCategory =
  | 'Mental Health Counselling'
  | 'Legal Aid'
  | 'Medical Assistance'
  | 'Social Welfare & Rehabilitation'
  | 'Emergency Support'
  | 'Witness Protection Information';

export type ReferralStatus =
  | 'Recommended'
  | 'Pending Confirmation'
  | 'Connected'
  | 'Completed';

export type IntakeChannel = 'Web Portal' | 'Simulated Voice' | 'Helpline Relay';

export interface IndicatorContribution {
  domain: string;
  signalStrength: number; // 0-100
  description: string;
  matchedTerms: string[];
}

export interface PreliminaryAssessment {
  sviScore: number; // 0-100
  priority: PriorityLevel;
  confidencePercent: number; // e.g., 68-85%
  uncertaintyMargin: number; // e.g., +/- 10
  uncertaintyNote: string;
  indicators: IndicatorContribution[];
  urgentSafetyFlag: boolean;
  selfHarmOrDangerFlag: boolean;
  disclaimer: string;
}

export interface OptionalQuestionResponse {
  id: string;
  questionLabel: string;
  answer: string | null; // null means skipped
  skipped: boolean;
}

export interface CaseNote {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  content: string;
  type: 'review' | 'referral' | 'override' | 'note';
}

export interface CaseRecord {
  id: string; // Anonymized ID e.g. NHAA-2026-8410
  firstContactAt: string; // ISO timestamp
  language: SupportedLanguage;
  languageLabel: string;
  channel: IntakeChannel;
  userConcerns: string;
  questionResponses: OptionalQuestionResponse[];
  aiAssessment: PreliminaryAssessment;
  reviewStatus: ReviewStatus;
  humanOverriddenPriority?: PriorityLevel;
  humanOverrideReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  recommendedReferrals: ReferralCategory[];
  notes: CaseNote[];
}

export interface ReferralEntry {
  id: string;
  caseId: string;
  category: ReferralCategory;
  resourceName: string;
  status: ReferralStatus;
  confirmedBy: string;
  updatedAt: string;
  notes: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  caseId?: string;
  timestamp: string;
  read: boolean;
  level: 'info' | 'attention';
}

export interface ResourceCardItem {
  id: string;
  category: ReferralCategory;
  title: string;
  description: string;
  availability: string;
  mockContact: string;
  eligibilityNote: string;
  humanConfirmationRequired: boolean;
}
