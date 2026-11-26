import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_SYNTHETIC_CASES,
  INITIAL_SYNTHETIC_REFERRALS,
} from '../data/mockCases';
import {
  AppNotification,
  CaseNote,
  CaseRecord,
  PriorityLevel,
  ReferralCategory,
  ReferralEntry,
  ReferralStatus,
  ReviewStatus,
  SupportedLanguage,
} from '../types';

export type DemoRole = 'Authorized Support Officer' | 'Senior Case Supervisor';

interface AppContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  role: DemoRole;
  setRole: (role: DemoRole) => void;
  officerName: string;
  cases: CaseRecord[];
  referrals: ReferralEntry[];
  notifications: AppNotification[];
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  simulateLoading: boolean;
  triggerLoadingDemo: () => void;
  humanModalOpen: boolean;
  setHumanModalOpen: (open: boolean) => void;
  addCaseFromAssessment: (newCase: CaseRecord) => void;
  updateCaseReviewStatus: (
    caseId: string,
    status: ReviewStatus,
    noteText?: string
  ) => void;
  overrideCasePriority: (
    caseId: string,
    newPriority: PriorityLevel,
    reason: string
  ) => void;
  recommendReferralForCase: (
    caseId: string,
    category: ReferralCategory,
    notes: string
  ) => void;
  addCaseNote: (caseId: string, content: string) => void;
  updateReferralStatus: (referralId: string, status: ReferralStatus) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  logHumanCallbackRequest: (preferredLanguage: SupportedLanguage, briefNote: string) => void;
  purgeSessionData: () => void;
  resetDemoDataset: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Intake Awaiting Review',
    message: 'Case NHAA-2026-8410 submitted via Web Portal (High preliminary indicator).',
    caseId: 'NHAA-2026-8410',
    timestamp: '2026-11-26T08:16:00Z',
    read: false,
    level: 'attention',
  },
  {
    id: 'notif-2',
    title: 'Human Follow-up Requested',
    message: 'Case NHAA-2026-8409 flagged for urgent human officer callback.',
    caseId: 'NHAA-2026-8409',
    timestamp: '2026-11-26T07:53:00Z',
    read: false,
    level: 'attention',
  },
  {
    id: 'notif-3',
    title: 'Referral Status Updated',
    message: 'NHAA-2026-8408 counselling slot confirmed by regional desk.',
    caseId: 'NHAA-2026-8408',
    timestamp: '2026-11-25T19:16:00Z',
    read: true,
    level: 'info',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [role, setRole] = useState<DemoRole>('Authorized Support Officer');
  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_SYNTHETIC_CASES);
  const [referrals, setReferrals] = useState<ReferralEntry[]>(INITIAL_SYNTHETIC_REFERRALS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [highContrast, setHighContrast] = useState(false);
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [humanModalOpen, setHumanModalOpen] = useState(false);

  const officerName =
    role === 'Senior Case Supervisor' ? 'Meera Deshmukh' : 'Dr. Ananya Rao';

  const triggerLoadingDemo = () => {
    setSimulateLoading(true);
    window.setTimeout(() => {
      setSimulateLoading(false);
    }, 900);
  };

  const addCaseFromAssessment = (newCase: CaseRecord) => {
    setCases((prev) => [newCase, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title:
          newCase.aiAssessment.priority === 'Critical' ||
          newCase.aiAssessment.priority === 'High'
            ? 'Priority Intake Queued for Human Review'
            : 'New Voluntary Assessment Received',
        message: `Case ${newCase.id} (${newCase.aiAssessment.priority} preliminary priority) requires human verification.`,
        caseId: newCase.id,
        timestamp: new Date().toISOString(),
        read: false,
        level:
          newCase.aiAssessment.priority === 'Critical' ||
          newCase.aiAssessment.priority === 'High'
            ? 'attention'
            : 'info',
      },
      ...prev,
    ]);
  };

  const updateCaseReviewStatus = (
    caseId: string,
    status: ReviewStatus,
    noteText?: string
  ) => {
    const now = new Date().toISOString();
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const nextNote: CaseNote = {
          id: `note-${Date.now()}`,
          author: officerName,
          role,
          timestamp: now,
          content:
            noteText ||
            `Human officer updated case review status to "${status}".`,
          type: 'review',
        };
        return {
          ...c,
          reviewStatus: status,
          reviewedBy: officerName,
          reviewedAt: now,
          notes: [nextNote, ...c.notes],
        };
      })
    );
  };

  const overrideCasePriority = (
    caseId: string,
    newPriority: PriorityLevel,
    reason: string
  ) => {
    const now = new Date().toISOString();
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const nextNote: CaseNote = {
          id: `note-${Date.now()}`,
          author: officerName,
          role,
          timestamp: now,
          content: `Human override: Support priority adjusted to ${newPriority}. Reason: ${reason}`,
          type: 'override',
        };
        return {
          ...c,
          humanOverriddenPriority: newPriority,
          humanOverrideReason: reason,
          reviewStatus: 'Reviewed',
          reviewedBy: officerName,
          reviewedAt: now,
          notes: [nextNote, ...c.notes],
        };
      })
    );
  };

  const recommendReferralForCase = (
    caseId: string,
    category: ReferralCategory,
    notes: string
  ) => {
    const now = new Date().toISOString();
    const resourceMap: Record<ReferralCategory, string> = {
      'Mental Health Counselling': 'Trauma-Informed Counselling Desk (Demo Mock)',
      'Legal Aid': 'Free Legal Aid & Rights Guidance Panel (Demo Mock)',
      'Medical Assistance': 'Medical Care & Documentation Support (Demo Mock)',
      'Social Welfare & Rehabilitation': 'Social Welfare & Relief Cell (Demo Mock)',
      'Emergency Support': 'Immediate Human Safety Response Desk (Demo Mock)',
      'Witness Protection Information': 'Witness Protection Information Cell (Demo Mock)',
    };

    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const updatedRecommended = c.recommendedReferrals.includes(category)
          ? c.recommendedReferrals
          : [...c.recommendedReferrals, category];
        const nextNote: CaseNote = {
          id: `note-${Date.now()}`,
          author: officerName,
          role,
          timestamp: now,
          content: `Human-confirmed referral logged for ${category}: ${notes}`,
          type: 'referral',
        };
        return {
          ...c,
          recommendedReferrals: updatedRecommended,
          notes: [nextNote, ...c.notes],
        };
      })
    );

    const newReferral: ReferralEntry = {
      id: `REF-2026-${Math.floor(200 + Math.random() * 799)}`,
      caseId,
      category,
      resourceName: resourceMap[category],
      status: 'Pending Confirmation',
      confirmedBy: officerName,
      updatedAt: now,
      notes,
    };
    setReferrals((prev) => [newReferral, ...prev]);
  };

  const addCaseNote = (caseId: string, content: string) => {
    const now = new Date().toISOString();
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const nextNote: CaseNote = {
          id: `note-${Date.now()}`,
          author: officerName,
          role,
          timestamp: now,
          content,
          type: 'note',
        };
        return {
          ...c,
          notes: [nextNote, ...c.notes],
        };
      })
    );
  };

  const updateReferralStatus = (referralId: string, status: ReferralStatus) => {
    const now = new Date().toISOString();
    setReferrals((prev) =>
      prev.map((r) =>
        r.id === referralId
          ? { ...r, status, updatedAt: now, confirmedBy: officerName }
          : r
      )
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const logHumanCallbackRequest = (
    preferredLanguage: SupportedLanguage,
    briefNote: string
  ) => {
    const langNames: Record<SupportedLanguage, string> = {
      en: 'English',
      hi: 'Hindi (हिन्दी)',
      kn: 'Kannada (ಕನ್ನಡ)',
    };
    const now = new Date().toISOString();
    const id = `NHAA-2026-${Math.floor(8411 + Math.random() * 500)}`;
    const directCase: CaseRecord = {
      id,
      firstContactAt: now,
      language: preferredLanguage,
      languageLabel: langNames[preferredLanguage],
      channel: 'Helpline Relay',
      userConcerns:
        briefNote.trim() ||
        'Requested direct connection with a human support worker without completing automated assessment.',
      questionResponses: [],
      aiAssessment: {
        sviScore: 50,
        priority: 'High',
        confidencePercent: 50,
        uncertaintyMargin: 16,
        uncertaintyNote:
          'User bypassed automated assessment and requested direct human support. No automated scoring performed.',
        indicators: [],
        urgentSafetyFlag: true,
        selfHarmOrDangerFlag: false,
        disclaimer:
          'Direct human support request — no automated AI text analysis was applied.',
      },
      reviewStatus: 'Follow-up Requested',
      recommendedReferrals: ['Emergency Support'],
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'Direct Human Support Queue',
          role: 'Consent-First Intake',
          timestamp: now,
          content:
            'Caller exercised right to speak directly to a trained human officer instead of automated screening.',
          type: 'note',
        },
      ],
    };
    addCaseFromAssessment(directCase);
  };

  const purgeSessionData = () => {
    setCases([]);
    setReferrals([]);
    setNotifications([]);
  };

  const resetDemoDataset = () => {
    setCases(INITIAL_SYNTHETIC_CASES);
    setReferrals(INITIAL_SYNTHETIC_REFERRALS);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        role,
        setRole,
        officerName,
        cases,
        referrals,
        notifications,
        highContrast,
        setHighContrast,
        simulateLoading,
        triggerLoadingDemo,
        humanModalOpen,
        setHumanModalOpen,
        addCaseFromAssessment,
        updateCaseReviewStatus,
        overrideCasePriority,
        recommendReferralForCase,
        addCaseNote,
        updateReferralStatus,
        markNotificationRead,
        markAllNotificationsRead,
        logHumanCallbackRequest,
        purgeSessionData,
        resetDemoDataset,
      }}
    >
      <div className={highContrast ? 'high-contrast-mode' : ''}>{children}</div>
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
