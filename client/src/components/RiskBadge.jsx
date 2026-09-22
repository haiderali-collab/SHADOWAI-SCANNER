import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, EyeOff } from 'lucide-react';

export function RiskBadge({ level, score }) {
  let badgeStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  let Icon = ShieldCheck;

  if (level === 'High') {
    badgeStyle = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 font-semibold';
    Icon = ShieldAlert;
  } else if (level === 'Medium') {
    badgeStyle = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    Icon = AlertTriangle;
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${badgeStyle}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{level}</span>
        {score !== undefined && (
          <span className="ml-1 pl-1.5 border-l border-current opacity-80 font-mono font-bold">
            {score}/100
          </span>
        )}
      </span>
    </div>
  );
}

export function ShadowBadge({ isShadow }) {
  if (!isShadow) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <ShieldCheck className="w-3 h-3" />
        Approved IT
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/30 shadow-glow-purple animate-pulse">
      <EyeOff className="w-3 h-3" />
      SHADOW / UNAPPROVED
    </span>
  );
}
