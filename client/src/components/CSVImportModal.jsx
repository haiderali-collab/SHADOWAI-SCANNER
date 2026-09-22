import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle } from 'lucide-react';
import API from '../services/api';

export default function CSVImportModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [csvText, setCsvText] = useState('');
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'text'
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const templateHeaders = 'Name,Category,Data Sensitivity,Compliance,Breach History,Approved by IT,Department,Description\n';
    const sampleRows =
      'Midjourney AI,AI Tool,Medium,No,No,No,Marketing,Image creation for ads\n' +
      'Notion,SaaS Vendor,High,Yes,No,Yes,Product,Company documentation wiki\n' +
      'Unapproved PDF Shrinker,SaaS Vendor,High,No,Yes,No,Finance,PDF file compressor tool\n';

    const blob = new Blob([templateHeaders + sampleRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shadow_ai_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      setError('');
      setSuccessMsg('');

      let res;
      if (activeTab === 'file') {
        if (!file) {
          setError('Please select a CSV file first.');
          setIsUploading(false);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        res = await API.post('/vendors/bulk-import', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        if (!csvText.trim()) {
          setError('Please paste CSV text data.');
          setIsUploading(false);
          return;
        }
        res = await API.post('/vendors/bulk-import', { csvText });
      }

      setSuccessMsg(res.data.message || 'Import successful!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Bulk import failed. Please check CSV format.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg p-6 relative shadow-2xl border-slate-700">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
            <h2 className="font-outfit font-bold text-lg text-slate-900 dark:text-white">
              Bulk CSV Import
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template download helper */}
        <div className="mt-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs flex items-center justify-between">
          <div>
            <p className="font-semibold text-indigo-600 dark:text-indigo-400">Need a CSV template?</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Download formatted sample file</p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            Template
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('file')}
            className={`pb-2 px-3 border-b-2 transition-colors ${
              activeTab === 'file'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload .CSV File
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`pb-2 px-3 border-b-2 transition-colors ${
              activeTab === 'text'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Raw CSV Text
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="mt-4">
          {activeTab === 'file' ? (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-900/40">
              <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".csv"
                id="csv-file-input"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label
                htmlFor="csv-file-input"
                className="cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Click to browse CSV file
              </label>
              {file && (
                <p className="mt-2 text-xs font-mono text-emerald-500 font-bold">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          ) : (
            <div>
              <textarea
                rows={5}
                placeholder="Name,Category,Data Sensitivity,Compliance,Breach History,Approved by IT..."
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
          >
            {isUploading ? 'Importing & Scoring...' : 'Start Bulk Import'}
          </button>
        </div>
      </div>
    </div>
  );
}
