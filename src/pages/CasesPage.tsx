import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Download, Filter, Plus, Search } from 'lucide-react';
import { PriorityIndicator, ReviewStatusText } from '../components/PriorityBadge';
import { useApp } from '../context/AppContext';
import { PriorityLevel, ReviewStatus } from '../types';

export const CasesPage: React.FC = () => {
  const { cases, simulateLoading } = useApp();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | PriorityLevel>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | ReviewStatus>('All');
  const [langFilter, setLangFilter] = useState<'All' | 'en' | 'hi' | 'kn'>('All');

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const effPriority = c.humanOverriddenPriority ?? c.aiAssessment.priority;
      if (priorityFilter !== 'All' && effPriority !== priorityFilter) return false;
      if (statusFilter !== 'All' && c.reviewStatus !== statusFilter) return false;
      if (langFilter !== 'All' && c.language !== langFilter) return false;

      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        c.id.toLowerCase().includes(q) ||
        c.userConcerns.toLowerCase().includes(q) ||
        c.languageLabel.toLowerCase().includes(q)
      );
    });
  }, [cases, query, priorityFilter, statusFilter, langFilter]);

  const handleExportSyntheticCsv = () => {
    const header = [
      'AnonymizedCaseID',
      'FirstContactUTC',
      'Language',
      'Channel',
      'PreliminarySVI',
      'EffectivePriority',
      'ReviewStatus',
    ];
    const rows = filtered.map((c) => [
      c.id,
      c.firstContactAt,
      c.languageLabel,
      c.channel,
      String(c.aiAssessment.sviScore),
      c.humanOverriddenPriority ?? c.aiAssessment.priority,
      c.reviewStatus,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sahaaya_synthetic_cases_summary.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0F2942]">
            Anonymized Case Directory
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Synthetic demonstration records. Open any case to verify indicators, record
            notes, or confirm referrals.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportSyntheticCsv}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export Summary CSV</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/assessment')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-5 relative">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Case ID (NHAA-2026-...) or keyword..."
            aria-label="Search cases"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-teal-600 focus:outline-none"
          />
        </div>

        <div className="lg:col-span-3 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as 'All' | PriorityLevel)
            }
            aria-label="Filter by support priority"
            className="w-full py-2 px-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-teal-600 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical Attention</option>
            <option value="High">High Priority</option>
            <option value="Moderate">Moderate Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'All' | ReviewStatus)
            }
            aria-label="Filter by human review status"
            className="w-full py-2 px-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-teal-600 focus:outline-none"
          >
            <option value="All">All Review States</option>
            <option value="Awaiting Review">Awaiting Review</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Follow-up Requested">Follow-up Requested</option>
            <option value="AI Assessment Dismissed">AI Assessment Dismissed</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            value={langFilter}
            onChange={(e) =>
              setLangFilter(e.target.value as 'All' | 'en' | 'hi' | 'kn')
            }
            aria-label="Filter by language"
            className="w-full py-2 px-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-teal-600 focus:outline-none"
          >
            <option value="All">All Languages</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {simulateLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm font-medium text-slate-800">
              No synthetic cases match these filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setPriorityFilter('All');
                setStatusFilter('All');
                setLangFilter('All');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">First Contact</th>
                  <th className="py-3 px-4">Language / Channel</th>
                  <th className="py-3 px-4">Preliminary SVI</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Human Review Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((c) => {
                  const effPriority =
                    c.humanOverriddenPriority ?? c.aiAssessment.priority;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#0F2942] whitespace-nowrap">
                        {c.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 tabular-nums whitespace-nowrap">
                        {new Date(c.firstContactAt).toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        <span>{c.languageLabel}</span>
                        <span className="text-slate-400"> · {c.channel}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums whitespace-nowrap">
                        <span className="font-semibold text-slate-900">
                          {c.aiAssessment.sviScore}
                        </span>
                        <span className="text-slate-400">
                          /100 (±{c.aiAssessment.uncertaintyMargin})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <PriorityIndicator
                          priority={effPriority}
                          overridden={Boolean(c.humanOverriddenPriority)}
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <ReviewStatusText status={c.reviewStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/cases/${c.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-900 hover:underline"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
