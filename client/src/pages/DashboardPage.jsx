import React from 'react';
import StatCard from '../components/StatCard';
import AlertBanner from '../components/AlertBanner';
import VendorTable from '../components/VendorTable';
import RecentActivityTable from '../components/RecentActivityTable';
import { Server, EyeOff, ShieldAlert, CheckCircle2, PieChart as PieIcon, BarChart3, Download } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

export default function DashboardPage({
  vendors = [],
  summary,
  detectionLogs = [],
  loading,
  logsLoading,
  onOpenAddModal,
  onOpenImportModal,
  onEditVendor,
  onDeleteVendor,
  onExportCSV
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-400">Loading Risk Intelligence Engine...</p>
      </div>
    );
  }

  const shadowVendors = vendors.filter(v => v.is_shadow === 1);
  const highRiskVendors = vendors.filter(v => v.risk_level === 'High');

  // Prepare Category Bar Chart Data
  const categoryMap = {};
  vendors.forEach((v) => {
    const cat = v.category || 'Other';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { category: cat, Approved: 0, Shadow: 0 };
    }
    if (v.approved_by_it === 1) {
      categoryMap[cat].Approved += 1;
    } else {
      categoryMap[cat].Shadow += 1;
    }
  });

  const categoryChartData = Object.values(categoryMap);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            Security Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time third-party software governance, AI discovery, and automated risk scoring.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vendors Tracked"
          value={summary?.totalCount || 0}
          subtext="Active third-party applications"
          icon={Server}
          color="indigo"
        />
        <StatCard
          title="Shadow / Unapproved"
          value={summary?.shadowCount || 0}
          subtext="Tools lacking IT sanctioning"
          icon={EyeOff}
          color="purple"
          accentBorder="border-l-4 border-fuchsia-500"
        />
        <StatCard
          title="High Risk Tools"
          value={summary?.highRiskCount || 0}
          subtext="Critical vulnerability posture"
          icon={ShieldAlert}
          color="rose"
          accentBorder="border-l-4 border-rose-500"
        />
        <StatCard
          title="Compliance Score"
          value={`${summary?.complianceRate || 0}%`}
          subtext="SOC2 / GDPR Certified"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Vulnerability Alert Banner */}
      <AlertBanner shadowVendors={shadowVendors} highRiskVendors={highRiskVendors} />

      {/* Recharts Data Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-500" />
              <h3 className="font-outfit font-bold text-sm text-slate-900 dark:text-white">
                Risk Distribution Breakdown
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">0-100 Score Algorithm</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary?.riskDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(summary?.riskDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#090d16" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>High Risk ({summary?.highRiskCount || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Medium Risk ({summary?.mediumRiskCount || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Low Risk ({summary?.lowRiskCount || 0})</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <h3 className="font-outfit font-bold text-sm text-slate-900 dark:text-white">
                Category Breakdown (Approved vs Shadow)
              </h3>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Shadow" fill="#d946ef" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PART 3: Recent Activity — Who's Using What Section */}
      <RecentActivityTable detectionLogs={detectionLogs} loading={logsLoading} />

      {/* Main Filterable Vendor Directory Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-outfit font-bold text-lg text-slate-900 dark:text-white">
            Monitored Software &amp; AI Tools Directory
          </h2>
          <button
            onClick={onOpenAddModal}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            + Add New Tool
          </button>
        </div>

        <VendorTable
          vendors={vendors}
          onEdit={onEditVendor}
          onDelete={onDeleteVendor}
        />
      </div>
    </div>
  );
}

