import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from 'recharts';
import {
  ArrowRight,
  Calendar,
  Clock,
  HeartHandshake,
  Info,
  Plus,
  Search,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { PriorityIndicator, ReviewStatusText } from '../components/PriorityBadge';
import { useApp } from '../context/AppContext';
import { PriorityLevel } from '../types';

export const DashboardOverview: React.FC = () => {
  const { cases, referrals, simulateLoading, triggerLoadingDemo } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | PriorityLevel>('All');
  const [dateFilter, setDateFilter] = useState('');

  const effectivePriority = (c: (typeof cases)[number]): PriorityLevel =>
    c.humanOverriddenPriority ?? c.aiAssessment.priority;

  const stats = useMemo(() => {
    const totalCases = cases.length;
    const awaitingReview = cases.filter(
      (c) => c.reviewStatus === 'Awaiting Review'
    ).length;
    const urgentAttention = cases.filter((c) => {
      const p = effectivePriority(c);
      return (
        (p === 'Critical' || p === 'High' || c.reviewStatus === 'Follow-up Requested') &&
        c.reviewStatus !== 'AI Assessment Dismissed'
      );
    }).length;
    const counsellingAndLegalReferrals = referrals.filter(
      (r) =>
        r.category === 'Mental Health Counselling' || r.category === 'Legal Aid'
    ).length;

    return {
      totalCases,
      awaitingReview,
      urgentAttention,
      counsellingAndLegalReferrals,
    };
  }, [cases, referrals]);

  const priorityDistributionData = useMemo(() => {
    const counts: Record<PriorityLevel, number> = {
      Low: 0,
      Moderate: 0,
      High: 0,
      Critical: 0,
    };
    for (const c of cases) {
      counts[effectivePriority(c)] += 1;
    }
    return [
      { name: 'Low', count: counts.Low, fill: '#0F766E' },
      { name: 'Moderate', count: counts.Moderate, fill: '#D97706' },
      { name: 'High', count: counts.High, fill: '#EA580C' },
      { name: 'Critical', count: counts.Critical, fill: '#9F1239' },
    ];
  }, [cases]);

  const intakeTrendData = useMemo(() => {
    const dayMap: Record<string, { day: string; intake: number; reviewed: number }> = {
      '2026-11-23': { day: 'Nov 23', intake: 1, reviewed: 1 },
      '2026-11-24': { day: 'Nov 24', intake: 2, reviewed: 1 },
      '2026-11-25': { day: 'Nov 25', intake: 2, reviewed: 2 },
      '2026-11-26': { day: 'Nov 26', intake: 2, reviewed: 0 },
    };

    // Reflect live added cases on current day
    const dynamicTodayCount = cases.filter((c) =>
      c.firstContactAt.startsWith('2026-11-26')
    ).length;
    const dynamicTodayReviewed = cases.filter(
      (c) =>
        c.firstContactAt.startsWith('2026-11-26') &&
        c.reviewStatus === 'Reviewed'
    ).length;

    dayMap['2026-11-26'] = {
      day: 'Nov 26',
      intake: dynamicTodayCount,
      reviewed: dynamicTodayReviewed,
    };

    return Object.values(dayMap);
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const p = effectivePriority(c);
      const matchesPriority = priorityFilter === 'All' || p === priorityFilter;
      const matchesDate =
        !dateFilter || c.firstContactAt.slice(0, 10) === dateFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.languageLabel.toLowerCase().includes(q) ||
        c.userConcerns.toLowerCase().includes(q) ||
        c.reviewStatus.toLowerCase().includes(q);
      return matchesPriority && matchesDate && matchesQuery;
    });
  }, [cases, priorityFilter, dateFilter, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setPriorityFilter('All');
    setDateFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Oversight Distinction Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#0F2942] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="font-display text-sm font-semibold text-[#0F2942]">
              AI Preliminary Indicators vs. Human Professional Decisions
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              Stress Vulnerability Index (SVI) scores and priority tiers shown below are{' '}
              <span className="font-semibold text-slate-800">
                preliminary automated indicators only
              </span>
              . Trained NHAA support personnel must review, verify, and confirm every
              priority override and referral decision.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={triggerLoadingDemo}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            Refresh Queue
          </button>
          <button
            type="button"
            onClick={() => navigate('/assessment')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>New Demo Assessment</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Total Cases Received</span>
            <Users className="w-4 h-4 text-[#0F2942]" aria-hidden="true" />
          </div>
          <div className="font-display text-3xl font-bold text-[#0F2942] tabular-nums">
            {simulateLoading ? '—' : stats.totalCases}
          </div>
          <p className="text-xs text-slate-500">Synthetic demonstration caseload</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Awaiting Professional Review</span>
            <Clock className="w-4 h-4 text-amber-700" aria-hidden="true" />
          </div>
          <div className="font-display text-3xl font-bold text-amber-800 tabular-nums">
            {simulateLoading ? '—' : stats.awaitingReview}
          </div>
          <p className="text-xs text-slate-500">Requires trained officer confirmation</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Urgent Human Attention</span>
            <ShieldAlert className="w-4 h-4 text-rose-800" aria-hidden="true" />
          </div>
          <div className="font-display text-3xl font-bold text-rose-900 tabular-nums">
            {simulateLoading ? '—' : stats.urgentAttention}
          </div>
          <p className="text-xs text-slate-500">High / Critical or follow-up requested</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Counselling & Legal Referrals</span>
            <HeartHandshake className="w-4 h-4 text-teal-700" aria-hidden="true" />
          </div>
          <div className="font-display text-3xl font-bold text-teal-800 tabular-nums">
            {simulateLoading ? '—' : stats.counsellingAndLegalReferrals}
          </div>
          <p className="text-xs text-slate-500">Human-confirmed support links</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              <h3 className="font-display text-base font-semibold text-[#0F2942]">
                Case Distribution by Preliminary Support Priority
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Reflects human-adjusted priority where overridden by an officer
              </p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-medium text-teal-700 hover:underline whitespace-nowrap"
            >
              Full Analytics
            </Link>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityDistributionData}
                margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#334155', fontSize: 12 }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Cases" radius={[6, 6, 0, 0]} maxBarSize={56}>
                  {priorityDistributionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-[#0F2942]">
              Recent Intake vs. Human Review Pace
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily synthetic intake and completed professional reviews
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={intakeTrendData}
                margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#334155', fontSize: 12 }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="intake"
                  name="Intake Submissions"
                  stroke="#0F2942"
                  fill="#CBD5E1"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="reviewed"
                  name="Human Reviewed"
                  stroke="#0D9488"
                  fill="#99F6E4"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Case List with Search, Priority Filter, and Date Selection */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-semibold text-[#0F2942]">
                Recent Anonymized Case Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any case ID to inspect AI indicator reasoning and record human
                review decisions
              </p>
            </div>
            <Link
              to="/cases"
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline whitespace-nowrap"
            >
              <span>View All Cases</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anonymized case ID, language, or concern..."
                aria-label="Search cases"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-teal-600 focus:outline-none"
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
              {(['All', 'Critical', 'High', 'Moderate', 'Low'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriorityFilter(level)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    priorityFilter === level
                      ? 'bg-white text-[#0F2942] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <div className="relative flex-1">
                <Calendar
                  className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  aria-label="Filter by contact date"
                  className="w-full pl-8 pr-2 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-teal-600 focus:outline-none"
                />
              </div>
              {(searchQuery || priorityFilter !== 'All' || dateFilter) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 whitespace-nowrap"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Content */}
        {simulateLoading ? (
          <div className="p-6 space-y-3" aria-busy="true" aria-label="Loading cases">
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="h-12 rounded-lg bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm font-medium text-slate-800">
              No synthetic cases match your current search or filter criteria.
            </p>
            <p className="text-xs text-slate-500">
              Adjust your search terms, clear the date filter, or submit a new demo
              assessment.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] rounded-lg hover:bg-slate-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
                  <th className="py-3 px-4">Anonymized Case ID</th>
                  <th className="py-3 px-4">First Contact</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Preliminary SVI</th>
                  <th className="py-3 px-4">Support Priority</th>
                  <th className="py-3 px-4">Human Review Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCases.slice(0, 6).map((c) => {
                  const effPriority = effectivePriority(c);
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-[#0F2942] whitespace-nowrap">
                        {c.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 tabular-nums whitespace-nowrap">
                        {new Date(c.firstContactAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        {c.languageLabel}
                      </td>
                      <td className="py-3.5 px-4 tabular-nums whitespace-nowrap">
                        <span className="font-mono font-semibold text-slate-900">
                          {c.aiAssessment.sviScore}
                        </span>
                        <span className="text-slate-400"> / 100</span>
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
                          <span>Review</span>
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
