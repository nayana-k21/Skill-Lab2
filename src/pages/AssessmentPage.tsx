import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Globe,
  Headphones,
  Info,
  Mic,
  MicOff,
  RotateCcw,
  ShieldCheck,
  SkipForward,
  Sparkles,
  Type,
} from 'lucide-react';
import { PriorityIndicator } from '../components/PriorityBadge';
import { useApp } from '../context/AppContext';
import { LANGUAGE_REGISTRY, t } from '../i18n/translations';
import {
  CaseRecord,
  OptionalQuestionResponse,
  PreliminaryAssessment,
  SupportedLanguage,
} from '../types';
import { runDeterministicAssessment } from '../utils/assessmentEngine';

type IntakeStep = 'consent' | 'intake' | 'result' | 'declined';

const DEMO_VOICE_TRANSCRIPTS: Record<SupportedLanguage, string[]> = {
  en: [
    'Since Tuesday I have been feeling very anxious and unable to sleep because someone threatened me near my workplace. I am indoors right now, and I just want to talk safely about legal options and counselling.',
    'I feel completely overwhelmed and isolated right now. I am worried about my safety when stepping outside and do not know who to trust nearby.',
  ],
  hi: [
    'पिछले कुछ दिनों से मुझे बहुत चिंता और नींद न आने की समस्या हो रही है। बाहर जाने में डर लगता है और मुझे किसी विश्वसनीय परामर्शदाता से बात करनी है।',
  ],
  kn: [
    'ಕಳೆದ ಕೆಲವು ದಿನಗಳಿಂದ ನನಗೆ ತುಂಬಾ ಆತಂಕ ಮತ್ತು ನಿದ್ರಾಹೀನತೆ ಉಂಟಾಗಿದೆ. ನಾನು ಸುರಕ್ಷಿತವಾಗಿದ್ದೇನೆ ಆದರೆ ಕಾನೂನು ಮತ್ತು ಸಮಾಲೋಚನೆ ನೆರವು ಬೇಕಾಗಿದೆ.',
  ],
};

export const AssessmentPage: React.FC = () => {
  const { language, setLanguage, setHumanModalOpen, addCaseFromAssessment } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState<IntakeStep>('consent');
  const [selectedLangNote, setSelectedLangNote] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [micSimActive, setMicSimActive] = useState(false);

  const [narrative, setNarrative] = useState('');
  const [safetyAns, setSafetyAns] = useState<string | null>(null);
  const [safetySkipped, setSafetySkipped] = useState(false);

  const [distressAns, setDistressAns] = useState<string | null>(null);
  const [distressSkipped, setDistressSkipped] = useState(false);

  const [isolationAns, setIsolationAns] = useState<string | null>(null);
  const [isolationSkipped, setIsolationSkipped] = useState(false);

  const [supportAns, setSupportAns] = useState<string | null>(null);
  const [supportSkipped, setSupportSkipped] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [preliminaryResult, setPreliminaryResult] =
    useState<PreliminaryAssessment | null>(null);
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);

  const handleLanguagePick = (code: string) => {
    if (code === 'en' || code === 'hi' || code === 'kn') {
      setLanguage(code);
      setSelectedLangNote(null);
    } else {
      const langObj = LANGUAGE_REGISTRY.find((l) => l.code === code);
      setSelectedLangNote(
        `${langObj?.name} (${langObj?.nativeName}) translation pack is structurally registered for expansion. Continuing interface in English while preserving your preferred language tag for human officer matching.`
      );
    }
  };

  const simulateVoiceCapture = () => {
    setMicSimActive(true);
    window.setTimeout(() => {
      const samples = DEMO_VOICE_TRANSCRIPTS[language] ?? DEMO_VOICE_TRANSCRIPTS.en;
      const sample = samples[Math.floor(Math.random() * samples.length)];
      setNarrative((prev) => (prev.trim() ? `${prev.trim()} ${sample}` : sample));
      setMicSimActive(false);
      setValidationError(null);
    }, 900);
  };

  const buildResponses = (): OptionalQuestionResponse[] => [
    {
      id: 'safety',
      questionLabel: 'Immediate physical safety',
      answer: safetySkipped ? null : safetyAns,
      skipped: safetySkipped || safetyAns === null,
    },
    {
      id: 'distress',
      questionLabel: 'Recent emotional distress & sleep',
      answer: distressSkipped ? null : distressAns,
      skipped: distressSkipped || distressAns === null,
    },
    {
      id: 'isolation',
      questionLabel: 'Trusted nearby support',
      answer: isolationSkipped ? null : isolationAns,
      skipped: isolationSkipped || isolationAns === null,
    },
    {
      id: 'support',
      questionLabel: 'Preferred support type',
      answer: supportSkipped ? null : supportAns,
      skipped: supportSkipped || supportAns === null,
    },
  ];

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const responses = buildResponses();
    const hasAnyAnswer = responses.some((r) => !r.skipped && r.answer);
    if (!narrative.trim() && !hasAnyAnswer) {
      setValidationError(
        'Please share a brief note in your own words or answer at least one optional check-in question. You may also connect directly to a human support worker at any time.'
      );
      return;
    }
    setValidationError(null);
    const result = runDeterministicAssessment({
      text: narrative,
      responses,
    });
    setPreliminaryResult(result);
    setSubmittedCaseId(null);
    setStep('result');
  };

  const handleSubmitToQueue = () => {
    if (!preliminaryResult) return;
    const langLabels: Record<SupportedLanguage, string> = {
      en: 'English',
      hi: 'Hindi (हिन्दी)',
      kn: 'Kannada (ಕನ್ನಡ)',
    };
    const newId = `NHAA-2026-${Math.floor(8411 + Math.random() * 1400)}`;
    const now = new Date().toISOString();
    const responses = buildResponses();

    const inferredReferrals: CaseRecord['recommendedReferrals'] = [];
    if (supportAns?.includes('Counselling')) inferredReferrals.push('Mental Health Counselling');
    if (supportAns?.includes('Legal')) inferredReferrals.push('Legal Aid');
    if (supportAns?.includes('Medical')) inferredReferrals.push('Medical Assistance');
    if (preliminaryResult.urgentSafetyFlag) inferredReferrals.push('Emergency Support');
    if (inferredReferrals.length === 0) inferredReferrals.push('Mental Health Counselling');

    const newCase: CaseRecord = {
      id: newId,
      firstContactAt: now,
      language,
      languageLabel: langLabels[language],
      channel: inputMode === 'voice' ? 'Simulated Voice' : 'Web Portal',
      userConcerns:
        narrative.trim() ||
        'User opted to share structured check-in responses without free-text narrative.',
      questionResponses: responses,
      aiAssessment: preliminaryResult,
      reviewStatus: preliminaryResult.urgentSafetyFlag
        ? 'Follow-up Requested'
        : 'Awaiting Review',
      recommendedReferrals: Array.from(new Set(inferredReferrals)),
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'Voluntary Intake Portal',
          role: 'Informed Consent Recorded',
          timestamp: now,
          content:
            'Voluntary preliminary check-in submitted in-session. Awaiting human support worker verification.',
          type: 'note',
        },
      ],
    };

    addCaseFromAssessment(newCase);
    setSubmittedCaseId(newId);
  };

  const handleWithdrawAndReset = () => {
    setNarrative('');
    setSafetyAns(null);
    setSafetySkipped(false);
    setDistressAns(null);
    setDistressSkipped(false);
    setIsolationAns(null);
    setIsolationSkipped(false);
    setSupportAns(null);
    setSupportSkipped(false);
    setPreliminaryResult(null);
    setSubmittedCaseId(null);
    setValidationError(null);
    setStep('consent');
  };

  const loadSampleScenario = (type: 'moderate' | 'urgent') => {
    setValidationError(null);
    if (type === 'moderate') {
      setNarrative(
        'Feeling anxious and unable to sleep well after receiving intimidating messages about a local dispute. I am safe indoors with a family member, and would appreciate legal aid guidance and someone to talk to.'
      );
      setSafetyAns('Yes — currently in a safe location');
      setSafetySkipped(false);
      setDistressAns('Moderate — frequent worry and restless sleep');
      setDistressSkipped(false);
      setIsolationAns('Yes — staying with a trusted family member or friend');
      setIsolationSkipped(false);
      setSupportAns('Legal Aid & Mental Health Counselling');
      setSupportSkipped(false);
    } else {
      setNarrative(
        'I feel unsafe right now and am overwhelmed with fear after repeated threats near my home. I am alone here and feel exhausted and hopeless.'
      );
      setSafetyAns('No — feeling unsafe right now');
      setSafetySkipped(false);
      setDistressAns('Very High — feeling overwhelmed and unable to rest');
      setDistressSkipped(false);
      setIsolationAns('No one nearby right now');
      setIsolationSkipped(false);
      setSupportAns('Immediate human support worker & safety planning');
      setSupportSkipped(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Persistent Top Control Bar for Victim Assessment */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
          <span>
            Voluntary Check-In · You may skip any question or withdraw at any time
          </span>
        </div>
        <button
          type="button"
          onClick={() => setHumanModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <Headphones className="w-3.5 h-3.5 text-teal-300" aria-hidden="true" />
          <span>{t(language, 'connectHuman')}</span>
        </button>
      </div>

      {/* STEP 1: CONSENT & LANGUAGE SELECTION */}
      {step === 'consent' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-teal-700">
              Step 1 of 3 · Informed Consent & Language
            </p>
            <h2 className="font-display text-2xl font-bold text-[#0F2942]">
              {t(language, 'consentHeading')}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t(language, 'consentBody')}
            </p>
          </div>

          {/* Language Selector Grid */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <Globe className="w-4 h-4 text-teal-700" aria-hidden="true" />
              <span>Select Preferred Language / भाषा चुनें / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {LANGUAGE_REGISTRY.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguagePick(lang.code)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'border-teal-700 bg-teal-50/70 text-[#0F2942]'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-sm font-semibold">{lang.nativeName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {lang.name}
                      {!lang.available && ' · Ready for expansion'}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedLangNote && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {selectedLangNote}
              </p>
            )}
          </div>

          {/* Consent Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="text-sm font-semibold text-[#0F2942]">
                {t(language, 'consentCollectTitle')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(language, 'consentCollectDesc')} No audio is recorded, no personal
                data is written to browser storage, and no demographic traits are
                inferred.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="text-sm font-semibold text-[#0F2942]">
                {t(language, 'consentDisclaimerTitle')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(language, 'consentDisclaimerDesc')}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
            {t(language, 'legalNoticeUnverified')}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep('declined')}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {t(language, 'consentDecline')}
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setHumanModalOpen(true)}
                className="px-4 py-2.5 text-sm font-medium text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
              >
                Skip AI & Request Human Worker
              </button>
              <button
                type="button"
                onClick={() => setStep('intake')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
              >
                {t(language, 'consentAccept')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DECLINED SAFE EXIT SCREEN */}
      {step === 'declined' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="font-display text-xl font-bold text-[#0F2942]">
            Your Choice is Respected — No Information Was Saved
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            You chose not to participate in the automated check-in. Nothing was
            recorded or stored. You can still speak directly with a human support
            worker at any time or return to the portal.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setHumanModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors"
            >
              <Headphones className="w-4 h-4" />
              <span>{t(language, 'connectHuman')}</span>
            </button>
            <button
              type="button"
              onClick={() => setStep('consent')}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Return to Consent Screen
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: COMPASSIONATE INTAKE FORM */}
      {step === 'intake' && (
        <form
          onSubmit={handleAnalyze}
          className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-semibold text-teal-700">
                Step 2 of 3 · Voluntary Check-In
              </p>
              <h2 className="font-display text-xl font-bold text-[#0F2942] mt-0.5">
                Share at Your Own Pace
              </h2>
            </div>

            {/* Hackathon Evaluator Quick Fill */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-500">Demo Presets:</span>
              <button
                type="button"
                onClick={() => loadSampleScenario('moderate')}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Sample: Distress & Legal Aid
              </button>
              <button
                type="button"
                onClick={() => loadSampleScenario('urgent')}
                className="px-2.5 py-1 text-[11px] font-medium text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
              >
                Sample: Urgent Safety Concern
              </button>
            </div>
          </div>

          {/* Input Mode Switcher: Text vs Simulated Voice */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  inputMode === 'text'
                    ? 'bg-white text-[#0F2942] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Type className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t(language, 'modeText')}</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('voice')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  inputMode === 'voice'
                    ? 'bg-white text-[#0F2942] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mic className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t(language, 'modeVoice')}</span>
              </button>
            </div>

            {inputMode === 'voice' && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2942]">
                    {micSimActive ? (
                      <Mic className="w-4 h-4 text-teal-700 animate-pulse" />
                    ) : (
                      <MicOff className="w-4 h-4 text-slate-500" />
                    )}
                    <span>
                      Demonstration Microphone Interface (Audio is NOT recorded,
                      uploaded, or stored)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Click &ldquo;Simulate Voice Transcript&rdquo; to populate a
                    synthetic sample response in your chosen language without accessing
                    your device microphone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={simulateVoiceCapture}
                  disabled={micSimActive}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-slate-800 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  {micSimActive ? 'Simulating Transcript...' : 'Simulate Voice Transcript'}
                </button>
              </div>
            )}
          </div>

          {/* Free Text Narrative */}
          <div className="space-y-2">
            <label
              htmlFor="situation-text"
              className="block text-sm font-semibold text-[#0F2942]"
            >
              {t(language, 'situationLabel')}
            </label>
            <textarea
              id="situation-text"
              rows={4}
              value={narrative}
              onChange={(e) => {
                setNarrative(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder={t(language, 'situationPlaceholder')}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none"
            />
          </div>

          {/* 4 Optional Non-Leading Questions with Skip Option */}
          <div className="space-y-4 pt-2">
            <p className="text-xs font-semibold text-slate-500">
              Optional Check-In Questions (Select what applies or skip any item)
            </p>

            {/* Q1: Immediate safety */}
            <div className="p-4 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-[#0F2942]">
                  {t(language, 'safetyQuestion')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSafetySkipped(true);
                    setSafetyAns(null);
                  }}
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md border shrink-0 ${
                    safetySkipped
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <SkipForward className="w-3 h-3" aria-hidden="true" />
                  <span>{t(language, 'skipQuestion')}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Yes — currently in a safe location',
                  'Unsure — feeling uneasy right now',
                  'No — feeling unsafe right now',
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSafetyAns(opt);
                      setSafetySkipped(false);
                      setValidationError(null);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      safetyAns === opt && !safetySkipped
                        ? 'bg-teal-700 text-white border-teal-700 font-medium'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2: Emotional Distress */}
            <div className="p-4 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-[#0F2942]">
                  {t(language, 'distressQuestion')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDistressSkipped(true);
                    setDistressAns(null);
                  }}
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md border shrink-0 ${
                    distressSkipped
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <SkipForward className="w-3 h-3" aria-hidden="true" />
                  <span>{t(language, 'skipQuestion')}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Mild — occasional stress',
                  'Moderate — frequent worry and restless sleep',
                  'Very High — feeling overwhelmed and unable to rest',
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setDistressAns(opt);
                      setDistressSkipped(false);
                      setValidationError(null);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      distressAns === opt && !distressSkipped
                        ? 'bg-teal-700 text-white border-teal-700 font-medium'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: Social Support */}
            <div className="p-4 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-[#0F2942]">
                  {t(language, 'isolationQuestion')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsolationSkipped(true);
                    setIsolationAns(null);
                  }}
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md border shrink-0 ${
                    isolationSkipped
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <SkipForward className="w-3 h-3" aria-hidden="true" />
                  <span>{t(language, 'skipQuestion')}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Yes — staying with a trusted family member or friend',
                  'Limited — contact available by phone only',
                  'No one nearby right now',
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setIsolationAns(opt);
                      setIsolationSkipped(false);
                      setValidationError(null);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      isolationAns === opt && !isolationSkipped
                        ? 'bg-teal-700 text-white border-teal-700 font-medium'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q4: Support Preference */}
            <div className="p-4 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-[#0F2942]">
                  {t(language, 'supportNeedQuestion')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSupportSkipped(true);
                    setSupportAns(null);
                  }}
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md border shrink-0 ${
                    supportSkipped
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <SkipForward className="w-3 h-3" aria-hidden="true" />
                  <span>{t(language, 'skipQuestion')}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Mental Health Counselling',
                  'Legal Aid & Mental Health Counselling',
                  'Medical Assistance & Welfare Guidance',
                  'Immediate human support worker & safety planning',
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSupportAns(opt);
                      setSupportSkipped(false);
                      setValidationError(null);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      supportAns === opt && !supportSkipped
                        ? 'bg-teal-700 text-white border-teal-700 font-medium'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {validationError && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleWithdrawAndReset}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Withdraw & Clear</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>{t(language, 'submitAssessment')}</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: PRELIMINARY INDICATOR RESULTS */}
      {step === 'result' && preliminaryResult && (
        <div className="space-y-6">
          {/* Compassionate Urgent Support Experience if immediate danger or self-harm phrasing detected */}
          {(preliminaryResult.selfHarmOrDangerFlag ||
            preliminaryResult.urgentSafetyFlag) && (
            <div
              role="region"
              aria-label="Compassionate Immediate Support Guidance"
              className="bg-rose-50 border border-rose-200 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-start gap-3">
                <HeartSectionIcon />
                <div className="space-y-2">
                  <h3 className="font-display text-lg font-bold text-rose-950">
                    You Do Not Have to Face This Alone — Support Is Available
                  </h3>
                  <p className="text-sm text-rose-900 leading-relaxed">
                    Some of what you shared suggests you may feel unsafe or deeply
                    overwhelmed right now. If you are in immediate danger, please move
                    to a safer place if possible and reach out to a trusted person or
                    qualified emergency support professional near you.
                  </p>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    Prototype Safeguard: This tool never automatically contacts police
                    or external third parties, and an automated score is never used on
                    its own for emergency action.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setHumanModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2942] hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Headphones className="w-4 h-4 text-teal-300" />
                  <span>Connect to a Human Support Worker Now</span>
                </button>
              </div>
            </div>
          )}

          {/* Preliminary Assessment Breakdown Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-semibold text-teal-700">
                  Step 3 of 3 · Preliminary Automated Summary
                </p>
                <h2 className="font-display text-xl font-bold text-[#0F2942] mt-0.5">
                  Stress Vulnerability Index (Preliminary Indicator)
                </h2>
              </div>
              <PriorityIndicator priority={preliminaryResult.priority} />
            </div>

            {/* Score & Confidence Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    Preliminary SVI Score (0–100)
                  </span>
                  <span className="font-mono text-3xl font-bold text-[#0F2942] tabular-nums">
                    {preliminaryResult.sviScore}
                    <span className="text-sm font-normal text-slate-500"> / 100</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      preliminaryResult.priority === 'Critical'
                        ? 'bg-rose-800'
                        : preliminaryResult.priority === 'High'
                        ? 'bg-orange-600'
                        : preliminaryResult.priority === 'Moderate'
                        ? 'bg-amber-600'
                        : 'bg-teal-700'
                    }`}
                    style={{ width: `${preliminaryResult.sviScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>0 Low</span>
                  <span>32 Mod</span>
                  <span>54 High</span>
                  <span>76+ Critical</span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    Confidence & Uncertainty Indicator
                  </span>
                  <span className="font-mono text-sm font-semibold text-[#0F2942] tabular-nums">
                    {preliminaryResult.confidencePercent}% (±
                    {preliminaryResult.uncertaintyMargin} pts)
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {preliminaryResult.uncertaintyNote}
                </p>
              </div>
            </div>

            {/* Contributing Indicators */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#0F2942]">
                General Indicators Contributing to This Preliminary Result
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {preliminaryResult.indicators.map((ind) => (
                  <div
                    key={ind.domain}
                    className="p-4 rounded-lg border border-slate-200 bg-white space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#0F2942]">
                        {ind.domain}
                      </span>
                      <span className="font-mono text-xs text-slate-600 tabular-nums">
                        Signal {ind.signalStrength}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ind.description}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Observed cues: {ind.matchedTerms.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Non-Diagnostic Disclaimer */}
            <div className="p-4 rounded-lg bg-slate-100 border border-slate-200 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#0F2942] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-[#0F2942]">
                  Important Limitation Notice:
                </span>{' '}
                {preliminaryResult.disclaimer}
              </p>
            </div>

            {/* Submission / Actions */}
            {submittedCaseId ? (
              <div className="p-4 rounded-lg bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-teal-900 space-y-0.5">
                    <p className="font-semibold">
                      Added to Support Dashboard Queue as {submittedCaseId}
                    </p>
                    <p>
                      A trained support professional can now review, adjust priority,
                      or confirm referrals on the Case Details screen.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/cases/${submittedCaseId}`)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Open Case Review ({submittedCaseId})
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('intake')}
                    className="px-4 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Edit Responses
                  </button>
                  <button
                    type="button"
                    onClick={handleWithdrawAndReset}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Withdraw & Discard
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleSubmitToQueue}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
                >
                  Submit to Support Queue for Human Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const HeartSectionIcon: React.FC = () => (
  <div className="p-2 rounded-lg bg-rose-100 text-rose-800 shrink-0">
    <Headphones className="w-5 h-5" aria-hidden="true" />
  </div>
);
