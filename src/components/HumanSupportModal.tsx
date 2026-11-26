import React, { useState } from 'react';
import { CheckCircle2, Headphones, PhoneCall, Shield, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SupportedLanguage } from '../types';

export const HumanSupportModal: React.FC = () => {
  const { humanModalOpen, setHumanModalOpen, language, logHumanCallbackRequest } = useApp();
  const [preferredLang, setPreferredLang] = useState<SupportedLanguage>(language);
  const [briefNote, setBriefNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!humanModalOpen) return null;

  const handleRequestSupport = (e: React.FormEvent) => {
    e.preventDefault();
    logHumanCallbackRequest(preferredLang, briefNote);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setBriefNote('');
    setHumanModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="human-support-title"
    >
      <div className="w-full max-w-lg rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-[#0F2942] text-white">
          <div className="flex items-center gap-2.5">
            <Headphones className="w-5 h-5 text-teal-300" aria-hidden="true" />
            <h2 id="human-support-title" className="text-base font-semibold">
              Connect to a Human Support Worker
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close human support dialog"
            className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {submitted ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-teal-50 border border-teal-200 text-teal-900">
                <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">
                    Demonstration Request Logged in Human Support Queue
                  </p>
                  <p className="text-teal-800 leading-relaxed">
                    An anonymized direct-human-assistance entry has been added to the
                    dashboard queue. In a live helpline deployment, a trained officer
                    would respond without requiring automated scoring.
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#0F2942] rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Return to Application
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-sm font-medium text-slate-900">
                  You never have to use an automated tool to receive help.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If you are in immediate physical danger or feeling overwhelmed, please
                  reach out to a trusted person nearby or contact qualified local
                  emergency support services. This prototype never automatically alerts
                  police or external third parties.
                </p>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-lg border border-teal-200 bg-teal-50/50">
                <PhoneCall className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
                <div className="text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">
                    NHAA 14566 Prototype Reference:
                  </span>{' '}
                  National Helpline Against Atrocities · Placeholder regional desk
                  integration for demonstration only.
                </div>
              </div>

              <form onSubmit={handleRequestSupport} className="space-y-4">
                <div>
                  <label
                    htmlFor="modal-pref-lang"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Preferred Language for Human Support
                  </label>
                  <select
                    id="modal-pref-lang"
                    value={preferredLang}
                    onChange={(e) => setPreferredLang(e.target.value as SupportedLanguage)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="modal-brief-note"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Optional short note for the support worker (no personal details needed)
                  </label>
                  <textarea
                    id="modal-brief-note"
                    rows={3}
                    value={briefNote}
                    onChange={(e) => setBriefNote(e.target.value)}
                    placeholder="Example: Would prefer to speak with a Hindi-speaking counsellor when available."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Shield className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                    <span>No PII stored in browser</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
                    >
                      Request Human Callback (Demo)
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
