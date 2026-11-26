import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Info,
  MessageSquarePlus,
  Scale,
  ShieldAlert,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { PriorityIndicator, ReviewStatusText } from '../components/PriorityBadge';
import { useApp } from '../context/AppContext';
import { PriorityLevel, ReferralCategory } from '../types';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    cases,
    updateCaseReviewStatus,
    overrideCasePriority,
    recommendReferralForCase,
    addCaseNote,
  } = useApp();

  const record = cases.find((c) => c.id === id);

  const [overrideOpen, setOverrideOpen] = useState(false);
  const [newPriority, setNewPriority] = useState<PriorityLevel>(
    record?.humanOverriddenPriority ?? record?.aiAssessment.priority ?? 'Moderate'
  );
  const [overrideReason, setOverrideReason] = useState('');

  const [pendingReferral, setPendingReferral] = useState<ReferralCategory | null>(null);
  const [referralConfirmedCheck, setReferralConfirmedCheck] = useState(false);
  const [referralNote, setReferralNote] = useState('');

  const [noteInput, setNoteInput] = useState('');
  const [actionBanner, setActionBanner] = useState<string | null>(null);

  if (!record) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
        <h2 className="font-display text-lg font-bold text-[#0F2942]">
          Case Not Found in Current Session
        </h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          The anonymized case ID could not be located in the active synthetic dataset.
          Session data is intentionally never persisted to browser storage.
        </p>
        <Link
          to="/cases"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Cases</span>
        </Link>
      </div>
    );
  }

  const effectivePriority =
    record.humanOverriddenPriority ?? record.aiAssessment.priority;

  const triggerFeedback = (msg: string) => {
    setActionBanner(msg);
    window.setTimeout(() => setActionBanner(null), 4000);
  };

  const handleMarkReviewed = () => {
    updateCaseReviewStatus(
      record.id,
      'Reviewed',
      'Authorized support officer reviewed AI indicators and verified complainant context.'
    );
    triggerFeedback(`Case ${record.id} marked as Reviewed.`);
  };

  const handleRequestFollowUp = () => {
    updateCaseReviewStatus(
      record.id,
      'Follow-up Requested',
      'Human support worker follow-up callback scheduled.'
    );
    triggerFeedback(`Human follow-up requested for ${record.id}.`);
  };

  const handleDismissAi = () => {
    updateCaseReviewStatus(
      record.id,
      'AI Assessment Dismissed',
      'Trained officer dismissed automated SVI indicator as not representative of the caller context.'
    );
    triggerFeedback(`Preliminary AI indicator dismissed by professional for ${record.id}.`);
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;
    overrideCasePriority(record.id, newPriority, overrideReason.trim());
    setOverrideOpen(false);
    setOverrideReason('');
    triggerFeedback(`Support priority manually adjusted to ${newPriority}.`);
  };

  const handleConfirmReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingReferral || !referralConfirmedCheck) return;
    recommendReferralForCase(
      record.id,
      pendingReferral,
      referralNote.trim() ||
        'Recommended and confirmed by trained support officer after human review.'
    );
    triggerFeedback(`${pendingReferral} referral logged with human confirmation.`);
    setPendingReferral(null);
    setReferralConfirmedCheck(false);
    setReferralNote('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addCaseNote(record.id, noteInput.trim());
    setNoteInput('');
    triggerFeedback('Synthetic case note recorded.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/cases"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0F2942]"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to All Cases</span>
        </Link>

        {actionBanner && (
          <div
            role="status"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-xs font-medium text-teal-900"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
            <span>{actionBanner}</span>
          </div>
        )}
      </div>

      {/* Header Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
              <span>Anonymized Record</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {new Date(record.firstContactAt).toLocaleString()}
              </span>
              <span aria-hidden="true">·</span>
              <span>{record.languageLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{record.channel}</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#0F2942] font-mono">
              {record.id}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PriorityIndicator
              priority={effectivePriority}
              overridden={Boolean(record.humanOverriddenPriority)}
            />
            <div className="px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50">
              <ReviewStatusText status={record.reviewStatus} />
            </div>
          </div>
        </div>

        {/* Professional Review Action Toolbar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleMarkReviewed}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Mark as Reviewed</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPendingReferral('Mental Health Counselling');
              setReferralConfirmedCheck(false);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#0F2942] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
            <span>Recommend Counselling</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPendingReferral('Legal Aid');
              setReferralConfirmedCheck(false);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#0F2942] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
            <span>Recommend Legal Aid</span>
          </button>

          <button
            type="button"
            onClick={handleRequestFollowUp}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-900 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Request Human Follow-up</span>
          </button>

          <button
            type="button"
            onClick={() => setOverrideOpen((o) => !o)}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Correct / Override Priority
          </button>

          <button
            type="button"
            onClick={handleDismissAi}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Dismiss AI Indicator</span>
          </button>
        </div>

        {/* Inline Human Override Panel */}
        {overrideOpen && (
          <form
            onSubmit={handleSaveOverride}
            className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3"
          >
            <p className="text-xs font-semibold text-[#0F2942]">
              Human Professional Priority Override
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              <input
                type="text"
                required
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Reason for adjusting preliminary AI priority..."
                className="sm:col-span-2 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOverrideOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0F2942] rounded-lg"
              >
                Save Human Override
              </button>
            </div>
          </form>
        )}

        {/* Inline Mandatory Human Confirmation for Referral */}
        {pendingReferral && (
          <form
            onSubmit={handleConfirmReferral}
            className="p-4 rounded-lg bg-teal-50/70 border border-teal-200 space-y-3"
          >
            <p className="text-xs font-semibold text-[#0F2942]">
              Human Confirmation Required: Recommend {pendingReferral}
            </p>
            <p className="text-xs text-slate-600">
              AI recommendations never initiate referrals, legal steps, or external
              contact independently. Confirm that a human officer has verified user
              consent.
            </p>
            <input
              type="text"
              value={referralNote}
              onChange={(e) => setReferralNote(e.target.value)}
              placeholder="Optional referral coordination note..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
            />
            <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={referralConfirmedCheck}
                onChange={(e) => setReferralConfirmedCheck(e.target.checked)}
                required
                className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              <span>
                I confirm human review and complainant consent for this {pendingReferral}{' '}
                referral.
              </span>
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingReferral(null)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!referralConfirmedCheck}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 disabled:opacity-50 rounded-lg"
              >
                Confirm & Record Referral
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Main Split: Left = User Reported Concerns & Check-In | Right = AI Preliminary Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-display text-base font-semibold text-[#0F2942]">
              User-Reported Concerns (Synthetic Demo)
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {record.userConcerns}
            </p>

            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-semibold text-slate-500">
                Optional Check-In Responses
              </h4>
              {record.questionResponses.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Caller requested direct human support without structured check-in.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
                  {record.questionResponses.map((qr) => (
                    <div
                      key={qr.id}
                      className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                    >
                      <span className="font-medium text-slate-700">
                        {qr.questionLabel}
                      </span>
                      <span
                        className={
                          qr.skipped
                            ? 'italic text-slate-400'
                            : 'text-[#0F2942] font-medium'
                        }
                      >
                        {qr.skipped ? 'Skipped by user' : qr.answer}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Referral Recommendations */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-[#0F2942]">
                Referral Recommendations
              </h3>
              <Link
                to="/referrals"
                className="text-xs font-medium text-teal-700 hover:underline"
              >
                Open Referral Center
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {record.recommendedReferrals.map((refCat) => (
                <span
                  key={refCat}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {refCat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Preliminary Indicators with Uncertainty Notes */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-[#0F2942]">
                AI-Generated Preliminary Indicators
              </h3>
              <span className="font-mono text-xs font-semibold text-slate-600 tabular-nums">
                SVI {record.aiAssessment.sviScore}/100 ·{' '}
                {record.aiAssessment.confidencePercent}% conf.
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Uncertainty & Limitation Note</p>
                <p className="mt-0.5 leading-relaxed">
                  {record.aiAssessment.uncertaintyNote}
                </p>
              </div>
            </div>

            {record.humanOverrideReason && (
              <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1">
                <p className="font-semibold">
                  Human Professional Override Active ({record.humanOverriddenPriority})
                </p>
                <p>{record.humanOverrideReason}</p>
              </div>
            )}

            <div className="space-y-2.5">
              {record.aiAssessment.indicators.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No automated text indicators generated for this entry.
                </p>
              ) : (
                record.aiAssessment.indicators.map((ind) => (
                  <div
                    key={ind.domain}
                    className="p-3.5 rounded-lg border border-slate-200 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0F2942]">
                        {ind.domain}
                      </span>
                      <span className="font-mono text-slate-600 tabular-nums">
                        {ind.signalStrength}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{ind.description}</p>
                    <p className="text-[11px] text-slate-500">
                      Cues: {ind.matchedTerms.join(', ')}
                    </p>
                  </div>
                ))
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              {record.aiAssessment.disclaimer}
            </p>
          </div>

          {/* Case Notes Log */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-display text-base font-semibold text-[#0F2942]">
              Professional Review Notes (Synthetic)
            </h3>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add human review or follow-up note..."
                aria-label="Add case note"
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-teal-600 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-slate-800 rounded-lg whitespace-nowrap"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Note</span>
              </button>
            </form>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {record.notes.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No case notes recorded yet.
                </p>
              ) : (
                record.notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-800">
                        {n.author} · {n.role}
                      </span>
                      <span className="tabular-nums">
                        {new Date(n.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{n.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
