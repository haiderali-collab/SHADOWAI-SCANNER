import React from 'react';
import VendorTable from '../components/VendorTable';
import { Plus, Upload, Server } from 'lucide-react';

export default function VendorsPage({ vendors, onOpenAddModal, onOpenImportModal, onEditVendor, onDeleteVendor }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-indigo-500" />
            Vendor & AI Tool Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage all monitored software, generative AI assistants, and cloud vendors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImportModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Tool</span>
          </button>
        </div>
      </div>

      <VendorTable
        vendors={vendors}
        onEdit={onEditVendor}
        onDelete={onDeleteVendor}
      />
    </div>
  );
}
