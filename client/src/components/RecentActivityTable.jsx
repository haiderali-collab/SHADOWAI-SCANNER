import React from 'react';
import { RiskBadge } from './RiskBadge';
import { User, Activity, Clock, Layers } from 'lucide-react';

export default function RecentActivityTable({ detectionLogs = [], loading = false }) {
  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-outfit font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              Recent Activity — Who's Using What
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {detectionLogs.length} Events
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live identity attribution logs captured from active endpoint browser extensions.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px] font-bold text-slate-400">
            <tr>
              <th className="px-5 py-3.5">Employee Name &amp; Email</th>
              <th className="px-5 py-3.5">Tool Used</th>
              <th className="px-5 py-3.5">Risk Level</th>
              <th className="px-5 py-3.5">Detected At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-sans">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading detection activity logs...</span>
                  </div>
                </td>
              </tr>
            ) : detectionLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-1">
                      <User className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-slate-300 text-sm">No Recent Employee Detections</p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      When employees visit unsanctioned AI tools with the extension installed, usage events will appear here automatically.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              detectionLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Employee Name & Email */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                        {log.employee_name ? log.employee_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {log.employee_name || 'Unknown User'}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {log.employee_email || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tool Used */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {log.vendor_name}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {log.category || 'AI Tool'}
                      </span>
                    </div>
                  </td>

                  {/* Risk Level Badge */}
                  <td className="px-5 py-3.5">
                    <RiskBadge level={log.risk_level || 'Medium'} score={log.risk_score} />
                  </td>

                  {/* Detected At */}
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(log.detected_at)}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
