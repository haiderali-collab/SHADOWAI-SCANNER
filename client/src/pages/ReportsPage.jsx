import React from 'react';
import { FileText, Download, Printer, ShieldCheck, ShieldAlert, CheckCircle, EyeOff } from 'lucide-react';
import { RiskBadge, ShadowBadge } from '../components/RiskBadge';

export default function ReportsPage({ vendors, summary, onExportCSV }) {
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-500" />
            Security & Risk Compliance Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Export vendor risk registry and printable executive summary documents for audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Download CSV Report</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Executive PDF</span>
          </button>
        </div>
      </div>

      {/* Executive Printable Audit Container */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl print:shadow-none print:border-none print:bg-white print:text-black">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-outfit font-extrabold text-xl text-slate-900 dark:text-white print:text-black">
              Shadow AI & Vendor Risk Governance Report
            </h2>
            <p className="text-xs text-slate-500 print:text-slate-700 mt-1">
              Generated: {new Date().toLocaleDateString()} • Organization IT Security Operations
            </p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              CISO Audit Ready
            </span>
          </div>
        </div>

        {/* Overview Executive Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase text-slate-400">Total Software Monitored</p>
            <p className="text-2xl font-bold font-outfit text-slate-900 dark:text-white mt-1">{summary?.totalCount || 0}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase text-slate-400">Shadow Tools Count</p>
            <p className="text-2xl font-bold font-outfit text-fuchsia-500 mt-1">{summary?.shadowCount || 0}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase text-slate-400">High Risk Count</p>
            <p className="text-2xl font-bold font-outfit text-rose-500 mt-1">{summary?.highRiskCount || 0}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase text-slate-400">Compliance Rate</p>
            <p className="text-2xl font-bold font-outfit text-emerald-500 mt-1">{summary?.complianceRate || 0}%</p>
          </div>
        </div>

        {/* Detailed Risk Register Table */}
        <div>
          <h3 className="font-outfit font-bold text-sm text-slate-900 dark:text-white mb-3 print:text-black">
            Complete Monitored Software Registry
          </h3>

          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold uppercase">
              <tr>
                <th className="py-2.5 px-3 border-b">Vendor Name</th>
                <th className="py-2.5 px-3 border-b">Category</th>
                <th className="py-2.5 px-3 border-b">Data Sensitivity</th>
                <th className="py-2.5 px-3 border-b">IT Approval</th>
                <th className="py-2.5 px-3 border-b">Risk Level</th>
                <th className="py-2.5 px-3 border-b">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white print:text-black">{v.name}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{v.category}</td>
                  <td className="py-2.5 px-3">{v.data_sensitivity}</td>
                  <td className="py-2.5 px-3">
                    <ShadowBadge isShadow={v.is_shadow === 1} />
                  </td>
                  <td className="py-2.5 px-3">
                    <RiskBadge level={v.risk_level} />
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold">{v.risk_score}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
