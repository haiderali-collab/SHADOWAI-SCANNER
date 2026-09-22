import React from 'react';
import { ShieldAlert, EyeOff, AlertTriangle, CheckCircle, Lock, ArrowUpRight } from 'lucide-react';
import { RiskBadge, ShadowBadge } from '../components/RiskBadge';

export default function AlertsPage({ vendors, onEditVendor }) {
  // Shadow vendors
  const shadowTools = vendors.filter((v) => v.is_shadow === 1);
  // High risk vendors
  const highRiskTools = vendors.filter((v) => v.risk_level === 'High');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
          Risk & Shadow AI Scanner Hub
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Automated security vulnerability threats requiring SecOps review and approval workflow.
        </p>
      </div>

      {/* Summary Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">
              Unsanctioned Shadow Tools
            </span>
            <p className="text-2xl font-extrabold font-outfit text-white mt-1">
              {shadowTools.length} Detected
            </p>
          </div>
          <EyeOff className="w-8 h-8 text-fuchsia-400" />
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              High Risk Score Tools (65-100)
            </span>
            <p className="text-2xl font-extrabold font-outfit text-white mt-1">
              {highRiskTools.length} Active
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-rose-400" />
        </div>
      </div>

      {/* Detailed Vulnerability Cards */}
      <div className="space-y-4">
        <h2 className="font-outfit font-bold text-lg text-slate-900 dark:text-white">
          Active Security Remediation Items
        </h2>

        {shadowTools.length === 0 && highRiskTools.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">All Software Compliant</h3>
            <p className="text-xs text-slate-400 mt-1">No shadow AI tools or high risk items currently identified.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...shadowTools, ...highRiskTools]
              .filter((v, idx, self) => self.findIndex(t => t.id === v.id) === idx)
              .map((vendor) => (
                <div
                  key={vendor.id}
                  className="glass-card p-5 border-l-4 border-rose-500 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {vendor.name}
                      </h3>
                      <RiskBadge level={vendor.risk_level} score={vendor.risk_score} />
                      <ShadowBadge isShadow={vendor.is_shadow === 1} />
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {vendor.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
                      <span>Category: <strong className="text-slate-300">{vendor.category}</strong></span>
                      <span>Department: <strong className="text-slate-300">{vendor.owner_department || 'Unassigned'}</strong></span>
                      <span>Data Sensitivity: <strong className="text-slate-300">{vendor.data_sensitivity}</strong></span>
                      <span>SOC2 Cert: <strong className={vendor.has_compliance ? 'text-emerald-400' : 'text-rose-400'}>{vendor.has_compliance ? 'Yes' : 'No'}</strong></span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => onEditVendor(vendor)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1"
                    >
                      <span>Review / Approve</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
