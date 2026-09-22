import React, { useState, useEffect } from 'react';
import { X, Shield, Sparkles, CheckCircle2, AlertTriangle, EyeOff } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

export default function VendorModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'AI Tool',
    data_sensitivity: 'High',
    has_compliance: 0,
    has_breach_history: 0,
    approved_by_it: 0, // Default to 0 so unapproved tools prompt shadow awareness
    owner_department: '',
    description: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'AI Tool',
        data_sensitivity: initialData.data_sensitivity || 'High',
        has_compliance: initialData.has_compliance ? 1 : 0,
        has_breach_history: initialData.has_breach_history ? 1 : 0,
        approved_by_it: initialData.approved_by_it !== undefined ? (initialData.approved_by_it ? 1 : 0) : 0,
        owner_department: initialData.owner_department || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'AI Tool',
        data_sensitivity: 'High',
        has_compliance: 0,
        has_breach_history: 0,
        approved_by_it: 0,
        owner_department: '',
        description: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  // Compute live risk score preview client-side
  const computePreview = () => {
    let score = 0;
    const sensMap = { High: 35, Medium: 20, Low: 5 };
    score += sensMap[formData.data_sensitivity] || 20;

    if (Number(formData.has_compliance) === 0) score += 25;
    if (Number(formData.has_breach_history) === 1) score += 25;
    if (Number(formData.approved_by_it) === 0) {
      score += 15;
      if (formData.data_sensitivity === 'High') score += 10;
    }

    const finalScore = Math.min(100, Math.max(0, score));
    let level = 'Low';
    if (finalScore >= 65) level = 'High';
    else if (finalScore >= 30) level = 'Medium';

    return { score: finalScore, level, isShadow: Number(formData.approved_by_it) === 0 };
  };

  const preview = computePreview();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Vendor / Tool Name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving vendor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-xl p-6 relative shadow-2xl border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-outfit font-bold text-lg text-slate-900 dark:text-white">
                {initialData ? 'Edit Vendor / AI Tool' : 'Add New Vendor / AI Tool'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Provide security criteria to calculate risk metrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Live Risk Preview Banner */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Live Calculated Risk Score:
              </span>
            </div>
            <div className="flex items-center gap-2">
              {preview.isShadow && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-fuchsia-500/20 text-fuchsia-400 font-bold border border-fuchsia-500/30 flex items-center gap-1">
                  <EyeOff className="w-2.5 h-2.5" />
                  Shadow AI
                </span>
              )}
              <RiskBadge level={preview.level} score={preview.score} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vendor / Tool Name *
            </label>
            <input
              type="text"
              placeholder="e.g. ChatGPT Plus, DeepSeek Code, Canva Pro"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="AI Tool">Generative AI Tool</option>
                <option value="SaaS Vendor">SaaS Application</option>
                <option value="Cloud Provider">Cloud Infrastructure</option>
                <option value="Dev Tool">Developer / Code Tool</option>
                <option value="Marketing">Marketing / Analytics</option>
                <option value="Security & Data">Security & Data Storage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Data Sensitivity Level
              </label>
              <select
                value={formData.data_sensitivity}
                onChange={(e) => setFormData({ ...formData, data_sensitivity: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low">Low (Public data, promotional material)</option>
                <option value="Medium">Medium (Internal communications, docs)</option>
                <option value="High">High (PII, Financials, Source Code, API Keys)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Compliance Cert?
              </label>
              <select
                value={formData.has_compliance}
                onChange={(e) => setFormData({ ...formData, has_compliance: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={1}>Yes (SOC2 / GDPR / ISO)</option>
                <option value={0}>No Certification</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Known Breach History?
              </label>
              <select
                value={formData.has_breach_history}
                onChange={(e) => setFormData({ ...formData, has_breach_history: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={0}>No Reported Breaches</option>
                <option value={1}>Yes (Prior Incident)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Approved by IT?
              </label>
              <select
                value={formData.approved_by_it}
                onChange={(e) => setFormData({ ...formData, approved_by_it: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={1}>Yes (Sanctioned)</option>
                <option value={0}>No (Shadow AI / Unapproved)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Owner / Department (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Marketing, Engineering, HR"
                value={formData.owner_department}
                onChange={(e) => setFormData({ ...formData, owner_department: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Usage Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Provide context regarding how employees use this software..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Calculating & Saving...' : initialData ? 'Update Vendor' : 'Save Vendor & Scan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
