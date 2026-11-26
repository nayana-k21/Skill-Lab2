import {
  IndicatorContribution,
  OptionalQuestionResponse,
  PreliminaryAssessment,
  PriorityLevel,
} from '../types';

interface AssessmentInput {
  text: string;
  responses: OptionalQuestionResponse[];
}

const KEYWORD_DOMAINS: Array<{
  domain: string;
  weight: number;
  keywords: string[];
  description: string;
}> = [
  {
    domain: 'Immediate Safety & Threat Perception',
    weight: 30,
    keywords: [
      'unsafe',
      'threat',
      'threaten',
      'threatening',
      'following',
      'outside',
      'danger',
      'attack',
      'harm',
      'hurt',
      'weapon',
      'locked',
      'hiding',
      'assault',
      'असुरक्षित',
      'धमकी',
      'खतरा',
      'ಭಯ',
      'ಅಸುರಕ್ಷಿತ',
      'ಬೆದರಿಕೆ',
    ],
    description: 'Language indicates perceived physical threat, intimidation, or unsafe surroundings.',
  },
  {
    domain: 'Acute Emotional Distress & Sleep Disruption',
    weight: 24,
    keywords: [
      'panic',
      'crying',
      'sleep',
      'nightmare',
      'shaking',
      'overwhelmed',
      'terrified',
      'fear',
      'afraid',
      'scared',
      'anxious',
      'anxiety',
      'helpless',
      'hopeless',
      'exhausted',
      'breathe',
      'डर',
      'चिंता',
      'नींद',
      'घबराहट',
      'ಆತಂಕ',
      'ನಿದ್ರೆ',
      'ಒತ್ತಡ',
    ],
    description: 'Expressions suggest elevated anxiety, sleep disturbance, or acute emotional strain.',
  },
  {
    domain: 'Intimidation & Coercion Indicators',
    weight: 20,
    keywords: [
      'withdraw',
      'pressure',
      'forced',
      'silence',
      'quiet',
      'warning',
      'retaliation',
      'harass',
      'harassment',
      'intimidation',
      'blackmail',
      'landlord',
      'workplace',
      'दबाव',
      'परेशान',
      'ಒತ್ತಾಯ',
    ],
    description: 'Context points toward external pressure, coercion, or fear of retaliation.',
  },
  {
    domain: 'Social Isolation & Support Gap',
    weight: 16,
    keywords: [
      'alone',
      'nobody',
      'no one',
      'isolated',
      'nowhere',
      'abandoned',
      'trust',
      'estranged',
      'left',
      'stranded',
      'अकेला',
      'अकेली',
      'कोई नहीं',
      'ಒಬ್ಬಂಟಿಯಾಗಿ',
      'ಯಾರೂ ಇಲ್ಲ',
    ],
    description: 'User mentions limited nearby support networks or feeling isolated.',
  },
  {
    domain: 'Crisis / Self-Harm Distress Signal',
    weight: 35,
    keywords: [
      'self-harm',
      'hurt myself',
      'end my life',
      'suicide',
      'suicidal',
      'cannot go on',
      'give up',
      'want to die',
      'no reason to live',
    ],
    description:
      'Phrases may indicate acute personal crisis requiring immediate, compassionate human check-in.',
  },
];

const SELF_HARM_OR_IMMEDIATE_DANGER_TERMS = [
  'self-harm',
  'hurt myself',
  'end my life',
  'suicide',
  'suicidal',
  'want to die',
  'no reason to live',
  'cannot go on',
  'attack',
  'weapon',
  'outside my door',
  'hiding',
  'immediate danger',
];

export function runDeterministicAssessment(input: AssessmentInput): PreliminaryAssessment {
  const normalized = input.text.toLowerCase();
  let score = 14; // Baseline intake floor when someone reaches out for help
  const indicators: IndicatorContribution[] = [];

  for (const group of KEYWORD_DOMAINS) {
    const matched = group.keywords.filter((kw) => normalized.includes(kw.toLowerCase()));
    if (matched.length > 0) {
      const strength = Math.min(95, 42 + matched.length * 16);
      score += Math.min(group.weight, 10 + matched.length * 8);
      indicators.push({
        domain: group.domain,
        signalStrength: strength,
        description: group.description,
        matchedTerms: matched.slice(0, 4),
      });
    }
  }

  // Incorporate optional non-leading structured responses deterministically
  let answeredCount = 0;
  let skippedCount = 0;

  for (const resp of input.responses) {
    if (resp.skipped || !resp.answer) {
      skippedCount += 1;
      continue;
    }
    answeredCount += 1;
    const ans = resp.answer.toLowerCase();

    if (resp.id === 'safety') {
      if (ans.includes('no') || ans.includes('unsafe')) {
        score += 24;
        indicators.push({
          domain: 'Self-Reported Safety Concern',
          signalStrength: 88,
          description: 'User indicated feeling physically unsafe in their current location.',
          matchedTerms: ['Safety check-in: Not safe'],
        });
      } else if (ans.includes('unsure')) {
        score += 12;
        indicators.push({
          domain: 'Uncertain Safety Environment',
          signalStrength: 58,
          description: 'User expressed uncertainty about immediate physical safety.',
          matchedTerms: ['Safety check-in: Unsure'],
        });
      }
    }

    if (resp.id === 'distress') {
      if (ans.includes('very high') || ans.includes('severe') || ans.includes('constant')) {
        score += 18;
      } else if (ans.includes('moderate') || ans.includes('frequent')) {
        score += 10;
      } else if (ans.includes('mild')) {
        score += 4;
      }
    }

    if (resp.id === 'isolation') {
      if (ans.includes('no one') || ans.includes('alone')) {
        score += 12;
        if (!indicators.some((i) => i.domain.includes('Isolation'))) {
          indicators.push({
            domain: 'Limited Immediate Support Network',
            signalStrength: 64,
            description: 'User reported having no trusted nearby contact at this moment.',
            matchedTerms: ['Support check-in: No nearby contact'],
          });
        }
      }
    }
  }

  if (indicators.length === 0 && input.text.trim().length > 0) {
    indicators.push({
      domain: 'General Help-Seeking Narrative',
      signalStrength: 35,
      description:
        'Text expresses concern or request for guidance without explicit acute threat keywords.',
      matchedTerms: ['General narrative intake'],
    });
  }

  const clampedScore = Math.max(8, Math.min(96, Math.round(score)));

  let priority: PriorityLevel = 'Low';
  if (clampedScore >= 76) {
    priority = 'Critical';
  } else if (clampedScore >= 54) {
    priority = 'High';
  } else if (clampedScore >= 32) {
    priority = 'Moderate';
  }

  const selfHarmOrDangerFlag =
    SELF_HARM_OR_IMMEDIATE_DANGER_TERMS.some((term) => normalized.includes(term)) ||
    input.responses.some(
      (r) => r.id === 'safety' && !r.skipped && r.answer?.toLowerCase().includes('unsafe')
    );

  // Confidence reflects input completeness (text length + answered questions vs skipped)
  const textDepthFactor = Math.min(18, Math.floor(input.text.trim().length / 25));
  const responseFactor = answeredCount * 6 - skippedCount * 3;
  const confidencePercent = Math.max(48, Math.min(84, 56 + textDepthFactor + responseFactor));
  const uncertaintyMargin = Math.max(8, Math.round((100 - confidencePercent) / 3));

  return {
    sviScore: clampedScore,
    priority,
    confidencePercent,
    uncertaintyMargin,
    uncertaintyNote:
      skippedCount > 0
        ? `Preliminary estimate has wider uncertainty (±${uncertaintyMargin} pts) because ${skippedCount} optional question(s) were respectfully skipped, or text context is brief.`
        : `Deterministic keyword & check-in indicator (±${uncertaintyMargin} pts uncertainty margin). Context nuance, tone, and lived situation can only be evaluated by a trained support worker.`,
    indicators,
    urgentSafetyFlag: priority === 'Critical' || selfHarmOrDangerFlag,
    selfHarmOrDangerFlag,
    disclaimer:
      'Preliminary indicator only — not a clinical diagnosis, psychological assessment, or prediction of future behavior. No demographic, caste, gender, or voice attributes are used. A qualified human professional must review before any referral or action.',
  };
}
