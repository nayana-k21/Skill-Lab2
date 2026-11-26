import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Database,
  EyeOff,
  FileWarning,
  Lock,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrivacyEthicsPage: React.FC = () => {
  const { purgeSessionData, resetDemoDataset, cases } = useApp();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const pillars = [
    {
      title: '1. Informed Consent',
      icon: CheckCircle2,
      body: 'Every automated check-in begins with plain-language disclosure explaining what is collected, why it is helpful, and how a human officer reviews it. Users may decline or skip directly to a human worker with zero penalty.',
    },
    {
      title: '2. Data Minimization',
      icon: Database,
      body: 'Only anonymized case IDs (e.g., NHAA-2026-8410) and user-volunteered text/check-in responses are held in active session memory. Names, phone numbers, addresses, and audio recordings are never collected or stored in this prototype.',
    },
    {
      title: '3. Confidentiality & Browser Safety',
      icon: EyeOff,
      body: 'Confidential case data is never written to browser localStorage/sessionStorage, never embedded in URL query parameters, and never printed to browser console logs.',
    },
    {
      title: '4. Role-Based Access',
      icon: Lock,
      body: 'Operational dashboards separate public assessment intake from authorized personnel review queues. In a production deployment, strict role-based authentication and audit trails are mandatory.',
    },
    {
      title: '5. Mandatory Human Oversight',
      icon: UserCheck,
      body: 'Automated SVI scores cannot trigger police dispatch, legal filings, witness protection orders, or external referrals. Trained human professionals must verify, adjust, or dismiss every preliminary indicator.',
    },
    {
      title: '6. Data Retention Controls',
      icon: Trash2,
      body: 'In this hackathon prototype, all synthetic records reside solely in volatile memory and clear automatically when the browser tab closes. Support staff can also purge session records immediately below.',
    },
    {
      title: '7. Assessment Limitations & Fairness',
      icon: FileWarning,
      body: 'Deterministic indicators cannot diagnose PTSD, clinical depression, or suicidal risk, nor predict behavior. The engine explicitly avoids inferring mental health from caste, ethnicity, gender, voice pitch, accent, or appearance.',
    },
    {
      title: '8. Right to Withdraw Consent',
      icon: ShieldCheck,
      body: 'Complainants can skip any individual question, withdraw mid-assessment without saving, or ask an officer to dismiss automated indicators at any point.',
    },
  ];

  const handlePurge = () => {
    purgeSessionData();
    setStatusMessage(
      'All in-memory session cases, referrals, and alerts have been cleared.'
    );
  };

  const handleReset = () => {
    resetDemoDataset();
    setStatusMessage('Synthetic demonstration dataset restored.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-2">
        <h2 className="font-display text-xl font-bold text-[#0F2942]">
          Privacy, Safety & Ethical AI Principles
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Sahaaya AI is designed around trauma-informed care and transparent algorithmic
          restraint. This prototype uses synthetic data only and makes no unverified
          claims of statutory, HIPAA, or clinical regulatory compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="bg-white rounded-xl border border-slate-200 p-6 space-y-2.5"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-5 h-5 text-teal-700 shrink-0" aria-hidden="true" />
                <h3 className="font-display text-base font-semibold text-[#0F2942]">
                  {p.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {p.body}
              </p>
            </div>
          );
        })}
      </div>

      {/* Interactive Data Retention & Withdrawal Control */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display text-base font-semibold text-[#0F2942]">
              Interactive Session Retention Control (Demo)
            </h3>
            <p className="text-xs text-slate-600">
              Currently holding{' '}
              <span className="font-mono font-semibold text-slate-900">
                {cases.length}
              </span>{' '}
              synthetic case(s) in volatile memory (0 bytes stored in browser storage).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePurge}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-900 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Purge Session Data</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Restore Synthetic Demo Data</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div
            role="status"
            className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-teal-700 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
