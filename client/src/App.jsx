import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import VendorModal from './components/VendorModal';
import CSVImportModal from './components/CSVImportModal';
import DashboardPage from './pages/DashboardPage';
import VendorsPage from './pages/VendorsPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import API from './services/api';

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [detectionLogs, setDetectionLogs] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isLogsLoading, setIsLogsLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const fetchVendors = useCallback(async () => {
    try {
      setIsDataLoading(true);
      const res = await API.get('/vendors');
      setVendors(res.data.vendors);
      setSummary(res.data.summary);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  const fetchDetectionLogs = useCallback(async () => {
    try {
      setIsLogsLoading(true);
      const res = await API.get('/detection-logs');
      setDetectionLogs(res.data.logs || []);
    } catch (err) {
      console.error('Failed to fetch detection logs:', err);
    } finally {
      setIsLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVendors();
      fetchDetectionLogs();
    }
  }, [isAuthenticated, fetchVendors, fetchDetectionLogs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle Add/Edit submit
  const handleSaveVendor = async (formData) => {
    if (editingVendor) {
      await API.put(`/vendors/${editingVendor.id}`, formData);
    } else {
      await API.post('/vendors', formData);
    }
    fetchVendors();
    fetchDetectionLogs();
  };

  // Handle Delete
  const handleDeleteVendor = async (vendor) => {
    if (window.confirm(`Are you sure you want to remove "${vendor.name}" from vendor scanner?`)) {
      try {
        await API.delete(`/vendors/${vendor.id}`);
        fetchVendors();
        fetchDetectionLogs();
      } catch (err) {
        alert('Failed to delete vendor.');
      }
    }
  };

  // Handle CSV Export
  const handleExportCSV = async () => {
    try {
      const response = await API.get('/vendors/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'shadow_ai_vendor_risk_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('CSV Export failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100 transition-colors">
      <Navbar
        onOpenAddModal={() => {
          setEditingVendor(null);
          setIsAddModalOpen(true);
        }}
        onOpenImportModal={() => setIsImportModalOpen(true)}
      />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  vendors={vendors}
                  summary={summary}
                  detectionLogs={detectionLogs}
                  loading={isDataLoading}
                  logsLoading={isLogsLoading}
                  onOpenAddModal={() => {
                    setEditingVendor(null);
                    setIsAddModalOpen(true);
                  }}
                  onOpenImportModal={() => setIsImportModalOpen(true)}
                  onEditVendor={(vendor) => {
                    setEditingVendor(vendor);
                    setIsAddModalOpen(true);
                  }}
                  onDeleteVendor={handleDeleteVendor}
                  onExportCSV={handleExportCSV}
                />
              }
            />
            <Route
              path="/vendors"
              element={
                <VendorsPage
                  vendors={vendors}
                  onOpenAddModal={() => {
                    setEditingVendor(null);
                    setIsAddModalOpen(true);
                  }}
                  onOpenImportModal={() => setIsImportModalOpen(true)}
                  onEditVendor={(vendor) => {
                    setEditingVendor(vendor);
                    setIsAddModalOpen(true);
                  }}
                  onDeleteVendor={handleDeleteVendor}
                />
              }
            />
            <Route
              path="/alerts"
              element={
                <AlertsPage
                  vendors={vendors}
                  onEditVendor={(vendor) => {
                    setEditingVendor(vendor);
                    setIsAddModalOpen(true);
                  }}
                />
              }
            />
            <Route
              path="/reports"
              element={
                <ReportsPage
                  vendors={vendors}
                  summary={summary}
                  onExportCSV={handleExportCSV}
                />
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Add / Edit Vendor Modal */}
      <VendorModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingVendor(null);
        }}
        onSubmit={handleSaveVendor}
        initialData={editingVendor}
      />

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={fetchVendors}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard/*" element={<ProtectedLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
