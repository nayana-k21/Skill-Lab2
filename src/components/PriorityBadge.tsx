import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Info,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { PriorityLevel, ReferralStatus, ReviewStatus } from '../types';

export const PriorityIndicator: React.FC<{
  priority: PriorityLevel;
  overridden?: boolean;
}> = ({ priority, overridden }) => {
  const config: Record<
    PriorityLevel,
    { text: string; colorClass: string; Icon: React.FC<{ className?: string }> }
  > = {
    Low: {
      text: 'Low Priority',
      colorClass: 'text-teal-800 bg-teal-50 border-teal-200',
      Icon: CheckCircle2,
    },
    Moderate: {
      text: 'Moderate Priority',
      colorClass: 'text-amber-800 bg-amber-50 border-amber-200',
      Icon: Info,
    },
    High: {
      text: 'High Priority',
      colorClass: 'text-orange-800 bg-orange-50 border-orange-200',
      Icon: AlertCircle,
    },
    Critical: {
      text: 'Critical Attention',
      colorClass: 'text-rose-900 bg-rose-50 border-rose-200',
      Icon: ShieldAlert,
    },
  };

  const { text, colorClass, Icon } = config[priority];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border whitespace-nowrap shrink-0 ${colorClass}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{text}</span>
      {overridden && (
        <span className="text-[11px] opacity-80 font-normal">(Human Adjusted)</span>
      )}
    </span>
  );
};

export const ReviewStatusText: React.FC<{ status: ReviewStatus }> = ({ status }) => {
  const styles: Record<ReviewStatus, { color: string; Icon: React.FC<{ className?: string }> }> = {
    'Awaiting Review': { color: 'text-amber-700', Icon: Clock },
    Reviewed: { color: 'text-teal-700', Icon: UserCheck },
    'Follow-up Requested': { color: 'text-rose-800', Icon: AlertCircle },
    'AI Assessment Dismissed': { color: 'text-slate-600', Icon: Info },
  };

  const { color, Icon } = styles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${color}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
};

export const ReferralStatusText: React.FC<{ status: ReferralStatus }> = ({ status }) => {
  const styles: Record<ReferralStatus, string> = {
    Recommended: 'text-slate-700',
    'Pending Confirmation': 'text-amber-700',
    Connected: 'text-teal-700',
    Completed: 'text-emerald-700',
  };

  return (
    <span className={`text-xs font-semibold whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
};
