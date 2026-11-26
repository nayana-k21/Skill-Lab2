import { CaseRecord, ReferralEntry, ResourceCardItem } from '../types';

export const INITIAL_SYNTHETIC_CASES: CaseRecord[] = [
  {
    id: 'NHAA-2026-8410',
    firstContactAt: '2026-11-26T08:15:00Z',
    language: 'en',
    languageLabel: 'English',
    channel: 'Web Portal',
    userConcerns:
      'Experiencing ongoing intimidation from local individuals after filing a workplace grievance. Feeling anxious at night and unable to sleep properly. Looking for confidential legal guidance and someone to speak with safely.',
    questionResponses: [
      {
        id: 'safety',
        questionLabel: 'Immediate physical safety',
        answer: 'Unsure — concerned about returning home alone after work',
        skipped: false,
      },
      {
        id: 'distress',
        questionLabel: 'Recent emotional distress & sleep',
        answer: 'High — frequent anxiety and difficulty sleeping',
        skipped: false,
      },
      {
        id: 'isolation',
        questionLabel: 'Trusted nearby support',
        answer: null,
        skipped: true,
      },
      {
        id: 'support',
        questionLabel: 'Preferred support type',
        answer: 'Legal aid & confidential counselling',
        skipped: false,
      },
    ],
    aiAssessment: {
      sviScore: 74,
      priority: 'High',
      confidencePercent: 76,
      uncertaintyMargin: 8,
      uncertaintyNote:
        'Preliminary indicator (±8 pts margin) with one skipped check-in item. Requires human verification of current commute safety.',
      indicators: [
        {
          domain: 'Intimidation & Coercion Indicators',
          signalStrength: 82,
          description: 'Context points toward external pressure and fear of retaliation.',
          matchedTerms: ['intimidation', 'grievance'],
        },
        {
          domain: 'Acute Emotional Distress & Sleep Disruption',
          signalStrength: 74,
          description: 'Expressions suggest elevated anxiety and sleep disturbance.',
          matchedTerms: ['anxious', 'sleep'],
        },
        {
          domain: 'Uncertain Safety Environment',
          signalStrength: 58,
          description: 'User expressed uncertainty about immediate physical safety.',
          matchedTerms: ['Safety check-in: Unsure'],
        },
      ],
      urgentSafetyFlag: false,
      selfHarmOrDangerFlag: false,
      disclaimer:
        'Preliminary indicator only — not a clinical diagnosis or behavioral prediction. Human review required.',
    },
    reviewStatus: 'Awaiting Review',
    recommendedReferrals: ['Legal Aid', 'Mental Health Counselling'],
    notes: [
      {
        id: 'note-1',
        author: 'System Intake Log',
        role: 'Automated Intake (Synthetic)',
        timestamp: '2026-11-26T08:15:10Z',
        content:
          'Voluntary assessment completed with informed consent. Queued for authorized human support worker review.',
        type: 'note',
      },
    ],
  },
  {
    id: 'NHAA-2026-8409',
    firstContactAt: '2026-11-26T07:40:00Z',
    language: 'hi',
    languageLabel: 'Hindi (हिन्दी)',
    channel: 'Simulated Voice',
    userConcerns:
      'परिवार के कुछ सदस्यों पर लगातार दबाव और धमकी दी जा रही है। घर से बाहर निकलने में डर लगता है और कोई पास में मदद के लिए नहीं है। कृपया किसी अधिकारी से बात करवाएं। (Synthetic summary: Reports ongoing intimidation and fear leaving residence with limited nearby support; requests human callback.)',
    questionResponses: [
      {
        id: 'safety',
        questionLabel: 'Immediate physical safety',
        answer: 'No — feeling unsafe at current location',
        skipped: false,
      },
      {
        id: 'distress',
        questionLabel: 'Recent emotional distress & sleep',
        answer: 'Very High — feeling overwhelmed and unable to rest',
        skipped: false,
      },
      {
        id: 'isolation',
        questionLabel: 'Trusted nearby support',
        answer: 'No one nearby right now',
        skipped: false,
      },
      {
        id: 'support',
        questionLabel: 'Preferred support type',
        answer: 'Immediate human support worker & safety planning',
        skipped: false,
      },
    ],
    aiAssessment: {
      sviScore: 88,
      priority: 'Critical',
      confidencePercent: 81,
      uncertaintyMargin: 6,
      uncertaintyNote:
        'High preliminary distress and self-reported safety concern (±6 pts margin). Human support officer must verify context directly before any referral.',
      indicators: [
        {
          domain: 'Immediate Safety & Threat Perception',
          signalStrength: 90,
          description: 'Self-reported unsafe environment and threat perception.',
          matchedTerms: ['धमकी', 'Safety check-in: Not safe'],
        },
        {
          domain: 'Social Isolation & Support Gap',
          signalStrength: 78,
          description: 'User reports limited nearby trusted support.',
          matchedTerms: ['Support check-in: No nearby contact'],
        },
      ],
      urgentSafetyFlag: true,
      selfHarmOrDangerFlag: true,
      disclaimer:
        'Preliminary indicator only — not a clinical diagnosis or emergency trigger. Human review mandatory.',
    },
    reviewStatus: 'Follow-up Requested',
    recommendedReferrals: ['Emergency Support', 'Witness Protection Information', 'Legal Aid'],
    notes: [
      {
        id: 'note-2',
        author: 'Meera Deshmukh',
        role: 'Senior Support Officer',
        timestamp: '2026-11-26T07:52:00Z',
        content:
          'Spoke briefly in Hindi to confirm immediate safety options and consent. Initiating verified regional human follow-up protocol.',
        type: 'review',
      },
    ],
  },
  {
    id: 'NHAA-2026-8408',
    firstContactAt: '2026-11-25T18:20:00Z',
    language: 'kn',
    languageLabel: 'Kannada (ಕನ್ನಡ)',
    channel: 'Web Portal',
    userConcerns:
      'ನಾನು ನನ್ನ ದೂರಿನ ಸ್ಥಿತಿಯ ಬಗ್ಗೆ ಆತಂಕದಲ್ಲಿದ್ದೇನೆ. ಕಳೆದ ವಾರದಿಂದ ಸರಿಯಾಗಿ ನಿದ್ರೆ ಬರುತ್ತಿಲ್ಲ, ಆದರೆ ನಾನು ಈಗ ಸುರಕ್ಷಿತ ಸ್ಥಳದಲ್ಲಿದ್ದೇನೆ. (Synthetic summary: Experiencing worry and poor sleep regarding complaint status, currently in a safe location.)',
    questionResponses: [
      {
        id: 'safety',
        questionLabel: 'Immediate physical safety',
        answer: 'Yes — currently in a safe location',
        skipped: false,
      },
      {
        id: 'distress',
        questionLabel: 'Recent emotional distress & sleep',
        answer: 'Moderate — frequent worry and restless sleep',
        skipped: false,
      },
      {
        id: 'isolation',
        questionLabel: 'Trusted nearby support',
        answer: 'Yes — staying with supportive relatives',
        skipped: false,
      },
      {
        id: 'support',
        questionLabel: 'Preferred support type',
        answer: 'Mental health counselling & case status guidance',
        skipped: false,
      },
    ],
    aiAssessment: {
      sviScore: 46,
      priority: 'Moderate',
      confidencePercent: 78,
      uncertaintyMargin: 7,
      uncertaintyNote:
        'Moderate stress indicator (±7 pts margin). Safe physical environment and family support reduce immediate escalation risk.',
      indicators: [
        {
          domain: 'Acute Emotional Distress & Sleep Disruption',
          signalStrength: 54,
          description: 'Mentioned worry and disrupted sleep over the past week.',
          matchedTerms: ['ಆತಂಕ', 'ನಿದ್ರೆ'],
        },
      ],
      urgentSafetyFlag: false,
      selfHarmOrDangerFlag: false,
      disclaimer:
        'Preliminary indicator only — not a clinical diagnosis. Human review required.',
    },
    reviewStatus: 'Reviewed',
    reviewedBy: 'Dr. Ananya Rao',
    reviewedAt: '2026-11-25T19:05:00Z',
    recommendedReferrals: ['Mental Health Counselling', 'Social Welfare & Rehabilitation'],
    notes: [
      {
        id: 'note-3',
        author: 'Dr. Ananya Rao',
        role: 'Authorized Support Officer',
        timestamp: '2026-11-25T19:05:00Z',
        content:
          'Reviewed Kannada intake. Confirmed user is staying safely with relatives. Recommended regional counselling session with consent.',
        type: 'review',
      },
    ],
  },
  {
    id: 'NHAA-2026-8407',
    firstContactAt: '2026-11-25T14:10:00Z',
    language: 'en',
    languageLabel: 'English',
    channel: 'Helpline Relay',
    userConcerns:
      'Seeking information about compensation and rehabilitation documentation after an earlier incident. Feeling stressed about paperwork deadlines, though physically safe at home.',
    questionResponses: [
      {
        id: 'safety',
        questionLabel: 'Immediate physical safety',
        answer: 'Yes — currently in a safe location',
        skipped: false,
      },
      {
        id: 'distress',
        questionLabel: 'Recent emotional distress & sleep',
        answer: 'Mild — occasional stress around documentation',
        skipped: false,
      },
      {
        id: 'isolation',
        questionLabel: 'Trusted nearby support',
        answer: 'Yes — community advocate assisting',
        skipped: false,
      },
      {
        id: 'support',
        questionLabel: 'Preferred support type',
        answer: 'Social welfare & rehabilitation information',
        skipped: false,
      },
    ],
    aiAssessment: {
      sviScore: 24,
      priority: 'Low',
      confidencePercent: 80,
      uncertaintyMargin: 7,
      uncertaintyNote:
        'Low preliminary distress score (±7 pts margin). Primary need appears informational and administrative.',
      indicators: [
        {
          domain: 'General Help-Seeking Narrative',
          signalStrength: 34,
          description: 'Administrative stress related to rehabilitation documentation.',
          matchedTerms: ['stressed', 'rehabilitation'],
        },
      ],
      urgentSafetyFlag: false,
      selfHarmOrDangerFlag: false,
      disclaimer:
        'Preliminary indicator only — not a clinical diagnosis. Human review required.',
    },
    reviewStatus: 'Reviewed',
    reviewedBy: 'Karthik Subramanian',
    reviewedAt: '2026-11-25T15:00:00Z',
    recommendedReferrals: ['Social Welfare & Rehabilitation'],
    notes: [
      {
        id: 'note-4',
        author: 'Karthik Subramanian',
        role: 'Authorized Support Officer',
        timestamp: '2026-11-25T15:00:00Z',
        content:
          'Provided checklist for rehabilitation scheme documentation and connected to welfare coordinator.',
        type: 'referral',
      },
    ],
  },
  {
    id: 'NHAA-2026-8406',
    firstContactAt: '2026-11-24T16:45:00Z',
    language: 'en',
    languageLabel: 'English',
    channel: 'Web Portal',
    userConcerns:
      'Was verbally harassed near my rented accommodation yesterday and feel panicked whenever someone knocks on the door. I skipped the family question because my relatives live far away and I feel alone here.',
    questionResponses: [
      {
        id: 'safety',
        questionLabel: 'Immediate physical safety',
        answer: 'Unsure — doors locked, feeling anxious',
        skipped: false,
      },
      {
        id: 'distress',
        questionLabel: 'Recent emotional distress & sleep',
        answer: 'High — panic and hypervigilance',
        skipped: false,
      },
      {
        id: 'isolation',
        questionLabel: 'Trusted nearby support',
        answer: null,
        skipped: true,
      },
      {
        id: 'support',
        questionLabel: 'Preferred support type',
        answer: 'Counselling & safe housing guidance',
        skipped: false,
      },
    ],
    aiAssessment: {
      sviScore: 68,
      priority: 'High',
      confidencePercent: 72,
      uncertaintyMargin: 9,
      uncertaintyNote:
        'Preliminary estimate (±9 pts margin) with 1 skipped item. High hypervigilance indicators noted for human follow-up.',
      indicators: [
        {
          domain: 'Acute Emotional Distress & Sleep Disruption',
          signalStrength: 78,
          description: 'Indicators of panic and hypervigilance after recent harassment.',
          matchedTerms: ['panicked', 'anxious'],
        },
        {
          domain: 'Social Isolation & Support Gap',
          signalStrength: 68,
          description: 'User describes feeling isolated far from family.',
          matchedTerms: ['alone'],
        },
      ],
      urgentSafetyFlag: false,
      selfHarmOrDangerFlag: false,
      disclaimer:
        'Preliminary indicator only — not a clinical diagnosis. Human review required.',
    },
    reviewStatus: 'Awaiting Review',
    recommendedReferrals: ['Mental Health Counselling', 'Legal Aid'],
    notes: [],
  },
  {
    id: 'NHAA-2026-8405',
    firstContactAt: '2026-11-24T11:30:00Z',
    language: 'hi',
    languageLabel: 'Hindi (हिन्दी)',
    channel: 'Web Portal',
    userConcerns:
      'चिकित्सा जांच और कानूनी सहायता की प्रक्रिया को लेकर तनाव महसूस हो रहा है। अभी सुरक्षित हूँ पर आगे के कदम समझने में मदद चाहिए। (Synthetic summary: Experiencing procedural stress around medical documentation and legal steps; currently safe.)',
    questionResponses: [
      {
        id: 'safety',
        questionLabel: 'Immediate physical safety',
        answer: 'Yes — currently in a safe location',
        skipped: false,
      },
      {
        id: 'distress',
        questionLabel: 'Recent emotional distress & sleep',
        answer: 'Moderate — procedural stress',
        skipped: false,
      },
      {
        id: 'isolation',
        questionLabel: 'Trusted nearby support',
        answer: 'Yes — friend accompanying',
        skipped: false,
      },
      {
        id: 'support',
        questionLabel: 'Preferred support type',
        answer: 'Medical assistance & legal aid',
        skipped: false,
      },
    ],
    aiAssessment: {
      sviScore: 39,
      priority: 'Moderate',
      confidencePercent: 75,
      uncertaintyMargin: 8,
      uncertaintyNote:
        'Moderate preliminary stress indicator (±8 pts margin). Supportive friend present.',
      indicators: [
        {
          domain: 'Acute Emotional Distress & Sleep Disruption',
          signalStrength: 45,
          description: 'Reports procedural stress regarding medical and legal steps.',
          matchedTerms: ['तनाव'],
        },
      ],
      urgentSafetyFlag: false,
      selfHarmOrDangerFlag: false,
      disclaimer:
        'Preliminary indicator only — not a clinical diagnosis. Human review required.',
    },
    reviewStatus: 'Reviewed',
    humanOverriddenPriority: 'Low',
    humanOverrideReason:
      'During human callback, complainant confirmed strong local legal advocate support and requested routine informational follow-up only.',
    reviewedBy: 'Dr. Ananya Rao',
    reviewedAt: '2026-11-24T13:15:00Z',
    recommendedReferrals: ['Medical Assistance', 'Legal Aid'],
    notes: [
      {
        id: 'note-5',
        author: 'Dr. Ananya Rao',
        role: 'Authorized Support Officer',
        timestamp: '2026-11-24T13:15:00Z',
        content:
          'Human review adjusted priority from Moderate to Low after confirming stable accommodation and active legal counsel.',
        type: 'override',
      },
    ],
  },
  {
    id: 'NHAA-2026-8404',
    firstContactAt: '2026-11-23T09:50:00Z',
    language: 'en',
    languageLabel: 'English',
    channel: 'Simulated Voice',
    userConcerns:
      'I feel completely exhausted and hopeless after months of harassment at my workplace. Nobody listens when I report it and I feel like I cannot go on dealing with this alone.',
    questionResponses: [
      {
        id: 'safety',
        questionLabel: 'Immediate physical safety',
        answer: 'Unsure — emotionally overwhelmed',
        skipped: false,
      },
      {
        id: 'distress',
        questionLabel: 'Recent emotional distress & sleep',
        answer: 'Very High — exhausted and hopeless',
        skipped: false,
      },
      {
        id: 'isolation',
        questionLabel: 'Trusted nearby support',
        answer: 'No one nearby right now',
        skipped: false,
      },
      {
        id: 'support',
        questionLabel: 'Preferred support type',
        answer: 'Counselling & human support worker',
        skipped: false,
      },
    ],
    aiAssessment: {
      sviScore: 86,
      priority: 'Critical',
      confidencePercent: 79,
      uncertaintyMargin: 7,
      uncertaintyNote:
        'Elevated emotional distress and crisis-related phrasing detected (±7 pts margin). Requires immediate compassionate human outreach.',
      indicators: [
        {
          domain: 'Crisis / Self-Harm Distress Signal',
          signalStrength: 89,
          description: 'Phrasing indicates severe emotional exhaustion requiring urgent human care.',
          matchedTerms: ['hopeless', 'cannot go on'],
        },
        {
          domain: 'Social Isolation & Support Gap',
          signalStrength: 76,
          description: 'Reports feeling unheard and isolated.',
          matchedTerms: ['nobody', 'alone'],
        },
      ],
      urgentSafetyFlag: true,
      selfHarmOrDangerFlag: true,
      disclaimer:
        'Preliminary indicator only — not a clinical diagnosis or risk prediction. Human review mandatory.',
    },
    reviewStatus: 'Reviewed',
    reviewedBy: 'Meera Deshmukh',
    reviewedAt: '2026-11-23T10:02:00Z',
    recommendedReferrals: ['Mental Health Counselling', 'Emergency Support', 'Legal Aid'],
    notes: [
      {
        id: 'note-6',
        author: 'Meera Deshmukh',
        role: 'Senior Support Officer',
        timestamp: '2026-11-23T10:02:00Z',
        content:
          'Immediate compassionate phone support provided. Connected user with trauma-informed counsellor with explicit user consent.',
        type: 'review',
      },
    ],
  },
];

export const INITIAL_SYNTHETIC_REFERRALS: ReferralEntry[] = [
  {
    id: 'REF-2026-101',
    caseId: 'NHAA-2026-8409',
    category: 'Emergency Support',
    resourceName: 'Regional Rapid Human Response Desk (Demo Mock)',
    status: 'Connected',
    confirmedBy: 'Meera Deshmukh',
    updatedAt: '2026-11-26T08:05:00Z',
    notes: 'Human officer confirmed user consent before coordinating safety check-in.',
  },
  {
    id: 'REF-2026-102',
    caseId: 'NHAA-2026-8408',
    category: 'Mental Health Counselling',
    resourceName: 'Trauma-Informed Tele-Counselling Unit (Demo Mock)',
    status: 'Connected',
    confirmedBy: 'Dr. Ananya Rao',
    updatedAt: '2026-11-25T19:15:00Z',
    notes: 'Scheduled Kannada-speaking counsellor slot per complainant preference.',
  },
  {
    id: 'REF-2026-103',
    caseId: 'NHAA-2026-8407',
    category: 'Social Welfare & Rehabilitation',
    resourceName: 'District Social Welfare Relief Cell (Demo Mock)',
    status: 'Completed',
    confirmedBy: 'Karthik Subramanian',
    updatedAt: '2026-11-25T15:30:00Z',
    notes: 'Checklist shared and welfare intake reference issued.',
  },
  {
    id: 'REF-2026-104',
    caseId: 'NHAA-2026-8405',
    category: 'Medical Assistance',
    resourceName: 'District Hospital Victim Care Wing (Demo Mock)',
    status: 'Pending Confirmation',
    confirmedBy: 'Dr. Ananya Rao',
    updatedAt: '2026-11-24T13:30:00Z',
    notes: 'Awaiting complainant confirmation on preferred clinic timing.',
  },
  {
    id: 'REF-2026-105',
    caseId: 'NHAA-2026-8404',
    category: 'Mental Health Counselling',
    resourceName: 'Trauma-Informed Tele-Counselling Unit (Demo Mock)',
    status: 'Connected',
    confirmedBy: 'Meera Deshmukh',
    updatedAt: '2026-11-23T10:15:00Z',
    notes: 'Ongoing weekly follow-up sessions initiated with explicit consent.',
  },
];

export const MOCK_RESOURCE_DIRECTORY: ResourceCardItem[] = [
  {
    id: 'res-counselling',
    category: 'Mental Health Counselling',
    title: 'Trauma-Informed Counselling Desk',
    description:
      'Confidential, non-judgmental psychological first aid and ongoing trauma-informed counselling in regional languages.',
    availability: 'Daily · 08:00–22:00 IST (Mock Schedule)',
    mockContact: '[Placeholder Contact] Regional Counselling Desk · Ext. 01',
    eligibilityNote: 'Open to all consenting complainants and family members.',
    humanConfirmationRequired: true,
  },
  {
    id: 'res-legal',
    category: 'Legal Aid',
    title: 'Free Legal Aid & Rights Guidance Panel',
    description:
      'Assistance with filing procedures, protective orders, SC/ST (PoA) Act awareness, and free legal representation referrals.',
    availability: 'Mon–Sat · 09:30–18:00 IST (Mock Schedule)',
    mockContact: '[Placeholder Contact] Legal Aid Clinic · Ext. 02',
    eligibilityNote: 'Requires human legal coordinator verification and user consent.',
    humanConfirmationRequired: true,
  },
  {
    id: 'res-medical',
    category: 'Medical Assistance',
    title: 'Medical Care & Documentation Support',
    description:
      'Coordination for urgent physical healthcare, trauma care, and sensitive medical-legal documentation.',
    availability: '24/7 Placeholder Triage Desk (Mock Schedule)',
    mockContact: '[Placeholder Contact] Medical Coordination Unit · Ext. 03',
    eligibilityNote: 'User consent required prior to sharing any appointment details.',
    humanConfirmationRequired: true,
  },
  {
    id: 'res-welfare',
    category: 'Social Welfare & Rehabilitation',
    title: 'Social Welfare, Shelter & Relief Schemes',
    description:
      'Guidance on temporary safe accommodation, statutory relief compensation, livelihood assistance, and educational continuity.',
    availability: 'Mon–Fri · 10:00–17:30 IST (Mock Schedule)',
    mockContact: '[Placeholder Contact] Welfare Relief Office · Ext. 04',
    eligibilityNote: 'Subject to statutory documentation verified by district officer.',
    humanConfirmationRequired: true,
  },
  {
    id: 'res-emergency',
    category: 'Emergency Support',
    title: 'Immediate Human Safety Response Coordination',
    description:
      'Direct escalation pathway connecting a trained senior helpline officer with a complainant reporting immediate physical danger.',
    availability: '24/7 Human Officer Desk (Mock Schedule)',
    mockContact: '[Placeholder Contact] NHAA 14566 Prototype Desk · Ext. 00',
    eligibilityNote: 'Never triggered automatically by AI; requires human verification.',
    humanConfirmationRequired: true,
  },
  {
    id: 'res-witness',
    category: 'Witness Protection Information',
    title: 'Witness & Complainant Protection Information Cell',
    description:
      'Plain-language guidance on confidentiality rights, in-camera proceedings, and formal protection request procedures.',
    availability: 'Mon–Sat · 09:00–18:00 IST (Mock Schedule)',
    mockContact: '[Placeholder Contact] Protection Information Desk · Ext. 05',
    eligibilityNote: 'Informational guidance only; formal protection is ordered by competent authorities.',
    humanConfirmationRequired: true,
  },
];
