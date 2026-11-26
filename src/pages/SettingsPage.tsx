import React, { useState } from 'react';
import { CheckCircle2, Globe, RefreshCw, Shield, Sliders } from 'lucide-react';
import { DemoRole, useApp } from '../context/AppContext';
import { SupportedLanguage } from '../types';

export const SettingsPage: React.FC = () => {
  const {
    language,
    setLanguage,
    role,
    setRole,
    highContrast,
    setHighContrast,
    triggerLoadingDemo,
    resetDemoDataset,
  } = useApp();

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const notify = (msg: string) => {
    setSavedNotice(msg);
    window.setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[#0F2942]">
          Prototype Settings & Accessibility
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Configure interface language, personnel view, accessibility contrast, and
          demonstration states.
        </p>
      </div>

      {savedNotice && (
        <div
          role="status"
          className="p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-xs font-medium text-teal-900 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Language Setting */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-teal-700" aria-hidden="true" />
          <h3 className="font-display text-base font-semibold text-[#0F2942]">
            Language Preference
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(
            [
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी (Hindi)' },
              { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
            ] as Array<{ code: SupportedLanguage; label: string }>
          ).map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setLanguage(item.code);
                notify(`Interface language updated to ${item.label}.`);
              }}
              className={`px-4 py-2.5 rounded-lg border text-xs font-semibold text-left transition-colors ${
                language === item.code
                  ? 'border-teal-700 bg-teal-50 text-[#0F2942]'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Role & Accessibility */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-teal-700" aria-hidden="true" />
          <h3 className="font-display text-base font-semibold text-[#0F2942]">
            Authorized Personnel Demo Role
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {(
            ['Authorized Support Officer', 'Senior Case Supervisor'] as DemoRole[]
          ).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                notify(`Switched demonstration role to ${r}.`);
              }}
              className={`px-4 py-2 rounded-lg border text-xs font-medium ${
                role === r
                  ? 'bg-[#0F2942] text-white border-[#0F2942]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#0F2942]">
              Enhanced Visual Contrast
            </p>
            <p className="text-xs text-slate-500">
              Increases surface and border contrast across all views
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={highContrast}
            onClick={() => {
              setHighContrast(!highContrast);
              notify(
                !highContrast
                  ? 'Enhanced contrast enabled.'
                  : 'Standard contrast restored.'
              );
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              highContrast
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {highContrast ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Hackathon Demo Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-teal-700" aria-hidden="true" />
          <h3 className="font-display text-base font-semibold text-[#0F2942]">
            Demonstration State Controls
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              triggerLoadingDemo();
              notify('Simulated brief loading skeleton state on dashboard tables.');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#0F2942] bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Preview Loading Skeleton State</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetDemoDataset();
              notify('Synthetic demonstration dataset reset to initial defaults.');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-slate-800 rounded-lg"
          >
            Reset All Demo Cases & Referrals
          </button>
        </div>
      </div>
    </div>
  );
};
