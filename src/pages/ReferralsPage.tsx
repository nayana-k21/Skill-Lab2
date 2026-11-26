import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  HeartHandshake,
  Info,
  LifeBuoy,
  Plus,
  Scale,
  Shield,
  Stethoscope,
  Users,
} from 'lucide-react';
import { ReferralStatusText } from '../components/PriorityBadge';
import { useApp } from '../context/AppContext';
import { MOCK_RESOURCE_DIRECTORY } from '../data/mockCases';
import { ReferralCategory, ReferralStatus } from '../types';

export const ReferralsPage: React.FC = () => {
  const { cases, referrals, recommendReferralForCase, updateReferralStatus } =
    useApp();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id ?? '');
  const [selectedCategory, setSelectedCategory] = useState<ReferralCategory>(
    'Mental Health Counselling'
  );
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const iconMap: Record<ReferralCategory, React.FC<{ className?: string }>> = {
    'Mental Health Counselling': HeartHandshake,
    'Legal Aid': Scale,
    'Medical Assistance': Stethoscope,
    'Social Welfare & Rehabilitation': Users,
    'Emergency Support': LifeBuoy,
    'Witness Protection Information': Shield,
  };

  const handleRecordReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || !confirmed) return;
    recommendReferralForCase(
      selectedCaseId,
      selectedCategory,
      notes.trim() || 'Recorded via Support & Referral Center with human verification.'
    );
    setSuccessMsg(
      `Referral for ${selectedCaseId} (${selectedCategory}) recorded with human confirmation.`
    );
    setNotes('');
    setConfirmed(false);
    setFormOpen(false);
    window.setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0F2942]">
            Support & Referral Center
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Demonstration mock directory with placeholder contacts. Every referral
            requires human officer confirmation and complainant consent.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!selectedCaseId && cases[0]) setSelectedCaseId(cases[0].id);
            setFormOpen((o) => !o);
          }}
          disabled={cases.length === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-lg whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Record New Referral</span>
        </button>
      </div>

      {/* Prototype Placeholder Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-950">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <span className="font-semibold">Mock Resource Notice:</span> All resource
          cards below contain clearly labeled placeholder contact endpoints for
          prototype demonstration. This application does not list unverified official
          telephone numbers or claim formal government accreditation.
        </p>
      </div>

      {successMsg && (
        <div
          role="status"
          className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center gap-2.5 text-xs font-medium text-teal-900"
        >
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Record Referral Form */}
      {formOpen && (
        <form
          onSubmit={handleRecordReferral}
          className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
        >
          <h3 className="font-display text-base font-semibold text-[#0F2942]">
            Record Human-Confirmed Referral
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="ref-case"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Anonymized Case ID
              </label>
              <select
                id="ref-case"
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} · {c.languageLabel} (
                    {c.humanOverriddenPriority ?? c.aiAssessment.priority})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="ref-cat"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Support Category
              </label>
              <select
                id="ref-cat"
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value as ReferralCategory)
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                {MOCK_RESOURCE_DIRECTORY.map((r) => (
                  <option key={r.id} value={r.category}>
                    {r.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="ref-notes"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Coordination Notes (No personal identifying information)
            </label>
            <input
              id="ref-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Example: Complainant requested morning callback in Kannada."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              required
              className="rounded border-slate-300 text-teal-700"
            />
            <span>
              I confirm that a trained support officer verified consent and reviewed
              this referral manually.
            </span>
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!confirmed}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] disabled:opacity-50 rounded-lg"
            >
              Save Referral Entry
            </button>
          </div>
        </form>
      )}

      {/* 6 Mock Resource Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {MOCK_RESOURCE_DIRECTORY.map((res) => {
          const Icon = iconMap[res.category];
          return (
            <div
              key={res.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-teal-800">{res.category}</span>
                  <span>Demo Mock Resource</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Icon className="w-5 h-5 text-[#0F2942] shrink-0 mt-0.5" aria-hidden="true" />
                  <h3 className="font-display text-base font-semibold text-[#0F2942]">
                    {res.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <p className="font-mono text-[11px] text-slate-700">
                  {res.mockContact}
                </p>
                <p className="text-[11px] text-slate-500">{res.availability}</p>
                <p className="text-[11px] text-slate-500">{res.eligibilityNote}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(res.category);
                    if (!selectedCaseId && cases[0]) setSelectedCaseId(cases[0].id);
                    setFormOpen(true);
                  }}
                  className="w-full mt-2 px-3 py-2 text-xs font-semibold text-[#0F2942] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Log Referral to This Desk
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Referral Status Tracker */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="font-display text-base font-semibold text-[#0F2942]">
            Recorded Referral Coordination Log
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Update referral status as authorized staff coordinate with support desks
          </p>
        </div>

        {referrals.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No referrals recorded in this session yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
                  <th className="py-3 px-4">Referral ID</th>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Category & Mock Desk</th>
                  <th className="py-3 px-4">Confirmed By</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {referrals.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800 whitespace-nowrap">
                      {r.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                      <Link
                        to={`/cases/${r.caseId}`}
                        className="text-teal-700 hover:underline font-medium"
                      >
                        {r.caseId}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{r.category}</div>
                      <div className="text-[11px] text-slate-500">{r.resourceName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {r.confirmedBy}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <ReferralStatusText status={r.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <select
                        value={r.status}
                        aria-label={`Update status for ${r.id}`}
                        onChange={(e) =>
                          updateReferralStatus(r.id, e.target.value as ReferralStatus)
                        }
                        className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white"
                      >
                        <option value="Recommended">Recommended</option>
                        <option value="Pending Confirmation">Pending Confirmation</option>
                        <option value="Connected">Connected</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
