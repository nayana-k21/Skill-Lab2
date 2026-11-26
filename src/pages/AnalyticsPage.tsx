import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { cases, referrals } = useApp();

  const languageStats = useMemo(() => {
    const map: Record<string, { lang: string; count: number; totalSvi: number }> = {};
    for (const c of cases) {
      if (!map[c.languageLabel]) {
        map[c.languageLabel] = { lang: c.languageLabel, count: 0, totalSvi: 0 };
      }
      map[c.languageLabel].count += 1;
      map[c.languageLabel].totalSvi += c.aiAssessment.sviScore;
    }
    return Object.values(map).map((item) => ({
      lang: item.lang,
      cases: item.count,
      avgSvi: item.count > 0 ? Math.round(item.totalSvi / item.count) : 0,
    }));
  }, [cases]);

  const oversightBreakdown = useMemo(() => {
    const reviewed = cases.filter((c) => c.reviewStatus === 'Reviewed').length;
    const awaiting = cases.filter((c) => c.reviewStatus === 'Awaiting Review').length;
    const followUp = cases.filter(
      (c) => c.reviewStatus === 'Follow-up Requested'
    ).length;
    const dismissed = cases.filter(
      (c) => c.reviewStatus === 'AI Assessment Dismissed'
    ).length;

    return [
      { name: 'Reviewed', value: reviewed, color: '#0F766E' },
      { name: 'Awaiting Review', value: awaiting, color: '#D97706' },
      { name: 'Follow-up Requested', value: followUp, color: '#9F1239' },
      { name: 'AI Dismissed', value: dismissed, color: '#64748B' },
    ].filter((x) => x.value > 0);
  }, [cases]);

  const referralCategoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of referrals) {
      counts[r.category] = (counts[r.category] || 0) + 1;
    }
    return Object.entries(counts).map(([category, count]) => ({
      category: category.replace(' & Rehabilitation', ''),
      count,
    }));
  }, [referrals]);

  const avgSvi = useMemo(() => {
    if (cases.length === 0) return 0;
    return Math.round(
      cases.reduce((acc, c) => acc + c.aiAssessment.sviScore, 0) / cases.length
    );
  }, [cases]);

  const overrideCount = cases.filter((c) => Boolean(c.humanOverriddenPriority)).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-[#0F2942]">
          Operational & Oversight Analytics (Synthetic Demo)
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Aggregate metrics update dynamically as demo assessments are submitted or
          reviewed by authorized personnel.
        </p>
      </div>

      {/* Ethics Safeguard Note */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3 text-xs text-slate-700">
        <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <span className="font-semibold text-[#0F2942]">Non-Profiling Analytics:</span>{' '}
          This module aggregates only anonymized intake volumes, language selection,
          human review rates, and referral coordination. It never collects, infers, or
          segments stress metrics by caste, ethnicity, gender, accent, or appearance.
        </p>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1">
          <p className="text-xs text-slate-500">Mean Preliminary SVI</p>
          <p className="font-display text-2xl font-bold text-[#0F2942] tabular-nums">
            {avgSvi} <span className="text-sm font-normal text-slate-400">/ 100</span>
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1">
          <p className="text-xs text-slate-500">Human Priority Overrides</p>
          <p className="font-display text-2xl font-bold text-[#0F2942] tabular-nums">
            {overrideCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1">
          <p className="text-xs text-slate-500">Active Referral Links</p>
          <p className="font-display text-2xl font-bold text-teal-800 tabular-nums">
            {referrals.length}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-display text-base font-semibold text-[#0F2942]">
            Cases & Average Preliminary SVI by Language
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Helps staff allocate multilingual support officers equitably
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={languageStats}
                margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="lang" tick={{ fontSize: 12, fill: '#334155' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="cases"
                  name="Case Count"
                  fill="#0F2942"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={44}
                />
                <Bar
                  dataKey="avgSvi"
                  name="Mean SVI"
                  fill="#0D9488"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-display text-base font-semibold text-[#0F2942]">
            Human Review Status Breakdown
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Tracks progress of mandatory professional verification
          </p>
          <div className="h-64 w-full flex items-center justify-center">
            {oversightBreakdown.length === 0 ? (
              <p className="text-xs text-slate-500">No active cases to visualize.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={oversightBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={3}
                  >
                    {oversightBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 mt-2">
            {oversightBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ backgroundColor: item.color }}
                />
                <span>
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-display text-base font-semibold text-[#0F2942]">
            Human-Confirmed Referrals by Support Category
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Distribution across counselling, legal aid, medical, and welfare desks
          </p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={referralCategoryData}
                margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#334155' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Referrals"
                  fill="#0F766E"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={56}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
