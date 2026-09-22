import React, { useState, useMemo } from 'react';
import { RiskBadge, ShadowBadge } from './RiskBadge';
import { Search, Filter, ArrowUpDown, Edit3, Trash2, CheckCircle2, XCircle, AlertTriangle, Plus } from 'lucide-react';

export default function VendorTable({ vendors = [], onEdit, onDelete, onAdd }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [approvalFilter, setApprovalFilter] = useState('All');
  const [sortField, setSortField] = useState('risk_score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Sort vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.owner_department && v.owner_department.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRisk = riskFilter === 'All' || v.risk_level === riskFilter;
      const matchesApproval =
        approvalFilter === 'All' ||
        (approvalFilter === 'Approved' && v.approved_by_it === 1) ||
        (approvalFilter === 'Shadow' && v.approved_by_it === 0);

      return matchesSearch && matchesRisk && matchesApproval;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [vendors, searchTerm, riskFilter, approvalFilter, sortField, sortOrder]);

  // Pagination slice
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage) || 1;
  const paginatedVendors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVendors.slice(start, start + itemsPerPage);
  }, [filteredVendors, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRiskFilter('All');
    setApprovalFilter('All');
    setCurrentPage(1);
  };

  return (
    <div className="glass-card overflow-hidden bg-[#111726] border border-slate-800 rounded-2xl shadow-xl">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0d1322]/60">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor name, category, or department..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-100 placeholder:text-slate-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Risk Only</option>
            <option value="Medium">Medium Risk Only</option>
            <option value="Low">Low Risk Only</option>
          </select>

          <select
            value={approvalFilter}
            onChange={(e) => {
              setApprovalFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="All">All IT Statuses</option>
            <option value="Approved">IT Approved</option>
            <option value="Shadow">Shadow / Unapproved</option>
          </select>

          {(searchTerm || riskFilter !== 'All' || approvalFilter !== 'All') && (
            <button
              onClick={clearFilters}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#090d16] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>Vendor Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('category')}>
                <div className="flex items-center gap-1">
                  <span>Category</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('risk_score')}>
                <div className="flex items-center gap-1">
                  <span>Risk Score</span>
                  <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                </div>
              </th>
              <th className="py-3 px-4">IT Sanction</th>
              <th className="py-3 px-4">Data Sensitivity</th>
              <th className="py-3 px-4 text-center">SOC2 / GDPR</th>
              <th className="py-3 px-4 text-center">Breach History</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedVendors.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto p-4">
                    <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-amber-400">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-200 text-sm">No Monitored Vendors Found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {vendors.length === 0
                          ? 'Your inventory is currently empty. Add your first third-party vendor or AI tool to begin scanning.'
                          : 'No entries match your current search filters.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {vendors.length === 0 && onAdd && (
                        <button
                          onClick={onAdd}
                          className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 flex items-center gap-1.5 shadow-glow-cyan"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Vendor</span>
                        </button>
                      )}
                      {(searchTerm || riskFilter !== 'All' || approvalFilter !== 'All') && (
                        <button
                          onClick={clearFilters}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-bold text-slate-100 block">
                        {vendor.name}
                      </span>
                      {vendor.owner_department && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Dept: {vendor.owner_department}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                      {vendor.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={vendor.risk_level} score={vendor.risk_score} />
                  </td>
                  <td className="py-3 px-4">
                    <ShadowBadge isShadow={vendor.is_shadow === 1} />
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block font-semibold ${
                      vendor.data_sensitivity === 'High' ? 'text-rose-400' :
                      vendor.data_sensitivity === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {vendor.data_sensitivity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {vendor.has_compliance === 1 ? (
                      <span className="inline-flex items-center text-emerald-400" title="Has SOC2/GDPR Certification">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-rose-400 opacity-60" title="No Compliance Certification">
                        <XCircle className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {vendor.has_breach_history === 1 ? (
                      <span className="inline-flex items-center text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[10px]" title="Known breach history recorded">
                        Breach Reported
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Clean</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(vendor)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        title="Edit vendor details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(vendor)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete vendor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-[#0d1322]/60">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredVendors.length)} of {filteredVendors.length} vendors
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-2.5 py-1 rounded-lg border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-300"
            >
              Prev
            </button>
            <span className="px-2 font-semibold text-slate-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-2.5 py-1 rounded-lg border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
