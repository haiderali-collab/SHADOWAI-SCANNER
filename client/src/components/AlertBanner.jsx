import React from 'react';
import { AlertOctagon, ShieldAlert, ChevronRight, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AlertBanner({ shadowVendors, highRiskVendors }) {
  const shadowCount = shadowVendors.length;
  const highRiskCount = highRiskVendors.length;

  if (shadowCount === 0 && highRiskCount === 0) {
    return (
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <AlertOctagon className="w-4 h-4" />
          <span>No urgent security alerts or unapproved tools detected.</span>
        </div>
      </div>
    );
  }

  // Combine top critical items (max 3)
  const alertList = [...shadowVendors, ...highRiskVendors]
    .filter((v, idx, self) => self.findIndex(t => t.id === v.id) === idx)
    .slice(0, 3);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-amber-950/20 to-slate-900 border border-rose-500/30 shadow-glow-rose text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-rose-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-outfit font-bold text-sm text-white flex items-center gap-2">
              Security Vulnerability Alert
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {shadowCount + highRiskCount} Issues
              </span>
            </h3>
            <p className="text-xs text-rose-200/80">
              {shadowCount} Unapproved Shadow AI tools & {highRiskCount} High Risk vendors detected in production.
            </p>
          </div>
        </div>

        <Link
          to="/alerts"
          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors shrink-0"
        >
          View All Security Alerts
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {alertList.map((vendor) => (
          <div
            key={vendor.id}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-rose-500/20 flex items-center justify-between text-xs"
          >
            <div className="min-w-0 pr-2">
              <p className="font-semibold text-white truncate">{vendor.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{vendor.category} • {vendor.owner_department || 'Unassigned'}</p>
            </div>
            <div className="shrink-0 flex items-center gap-1.5">
              {vendor.is_shadow === 1 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-fuchsia-500/20 text-fuchsia-300 font-bold border border-fuchsia-500/30 flex items-center gap-1">
                  <EyeOff className="w-2.5 h-2.5" />
                  Shadow
                </span>
              )}
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-mono font-bold">
                {vendor.risk_score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
