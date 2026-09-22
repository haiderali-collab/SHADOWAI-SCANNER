import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroRadarScanner from '../components/HeroRadarScanner';
import { Shield, EyeOff, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoEmail, setDemoEmail] = useState('');

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (demoEmail.trim()) {
      setDemoSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#070a12]/90 backdrop-blur-lg border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-glow-cyan">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-outfit font-extrabold text-base sm:text-lg text-white block leading-none">
                Shadow AI & Vendor Risk Scanner
              </span>
              <span className="text-[11px] text-slate-400">
                Enterprise Risk Intelligence
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#problem" className="hover:text-cyan-400 transition-colors">Risk Vector</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Capabilities</a>
            <a href="#dashboard-preview" className="hover:text-cyan-400 transition-colors">Dashboard Preview</a>
            <a href="#extension" className="hover:text-cyan-400 transition-colors">Chrome Extension</a>
          </nav>

          {/* Dashboard / Auth CTA */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan transition-all"
                >
                  View Security Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-cyan-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Real-Time Third-Party Governance</span>
          </div>

          <h1 className="font-outfit font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Eliminate Shadow AI Exposure Before Your Next Security Audit
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Discover unsanctioned generative AI tools and SaaS applications used across your enterprise. Score risk automatically by data sensitivity, compliance certs, and breach history — with real-time detection powered by Chrome Extension integration.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-glow-cyan transition-all"
            >
              View Security Dashboard
            </button>
            <button
              onClick={() => setDemoModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
            >
              Request Security Demo
            </button>
          </div>
        </div>

        {/* HERO INTERACTIVE SCANNER MOMENT */}
        <HeroRadarScanner />
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section id="problem" className="py-20 px-4 sm:px-8 border-t border-slate-800/80 bg-[#0b0f19]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-white">
              The Uncontrolled Shadow AI Risk Vector
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Employees adopt web utilities and AI assistants to move faster, unaware that unvetted platforms expose internal customer PII, source code, and confidential documents to public training sets and breach risks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800/90 space-y-3">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 w-fit border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-outfit font-bold text-base text-white">
                Unsanctioned Code & Data Ingestion
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Developers paste proprietary API keys or source code snippets into web AI tools without SOC2 Type II certifications or zero-data-retention agreements.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800/90 space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit border border-amber-500/20">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="font-outfit font-bold text-base text-white">
                Zero IT Approval Visibility
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Over 78% of enterprise AI usage happens on personal accounts or browser extensions without IT Security review, creating silent compliance blind spots.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800/90 space-y-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit border border-indigo-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-outfit font-bold text-base text-white">
                SOC2 & GDPR Audit Failures
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Auditors flag failure to maintain an exhaustive third-party software inventory and failure to verify vendor data privacy policies before processing PII.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS (THREE CAPABILITIES) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 border-t border-slate-800/80 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-white">
            Three Defense Layers for Third-Party Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Built from the ground up to automate software discovery, calculate deterministic risk scores, and alert security operations in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Layer 1 */}
          <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <h3 className="font-outfit font-bold text-lg text-white">
                Weighted Risk Scoring Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quantifies security risk on a 0 to 100 scale using deterministic criteria: data sensitivity levels (High/Medium/Low), SOC2/GDPR certification status, recorded breach history, and IT approval status with compound unapproved penalties.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-cyan-400">
              Risk = Data(35) + Compliance(25) + Breach(25) + Shadow(25)
            </div>
          </div>

          {/* Layer 2 */}
          <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <h3 className="font-outfit font-bold text-lg text-white">
                Security Intelligence Dashboard
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provides SecOps teams with KPI cards, Recharts risk distribution charts, multi-column search/sorting, bulk CSV import/export, and printable executive PDF audit reports for compliance documentation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-indigo-400">
              Inventory, Risk Distribution, CSV and PDF Export
            </div>
          </div>

          {/* Layer 3 */}
          <div id="extension" className="p-6 rounded-2xl bg-[#111726] border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <h3 className="font-outfit font-bold text-lg text-white">
                Chrome Extension Detection
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manifest V3 service worker monitors employee browsing against known AI tool hostnames (chatgpt.com, claude.ai, deepseek.com), auto-reporting unapproved tools to the backend API with a 1-hour rate limiting window.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-fuchsia-400">
              Manifest V3, Privacy Whitelist, 1-Hour Cooldown
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DASHBOARD MOCKUP PLACEHOLDER */}
      <section id="dashboard-preview" className="py-20 px-4 sm:px-8 border-t border-slate-800/80 bg-[#0b0f19]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-white">
              SecOps Command & Governance Interface
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Full visibility into monitored vendors, unapproved shadow tools, compliance rates, and vulnerability metrics.
            </p>
          </div>

          {/* DASHBOARD MOCKUP PLACEHOLDER - Replace with real screenshot asset */}
          <div className="rounded-2xl bg-[#090d16] border border-slate-800 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-bold text-slate-200">Shadow AI Scanner Interface</span>
              </div>
              <span className="hidden sm:inline">https://localhost:3000/dashboard</span>
            </div>

            {/* Simulated UI Content */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#111726] border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold">Total Tracked</span>
                  <p className="text-xl font-bold font-outfit text-white mt-1">12 Tools</p>
                </div>
                <div className="p-3 rounded-xl bg-[#111726] border border-slate-800 border-l-2 border-l-fuchsia-500">
                  <span className="text-[10px] text-slate-400 font-bold">Shadow Unapproved</span>
                  <p className="text-xl font-bold font-outfit text-fuchsia-400 mt-1">5 Tools</p>
                </div>
                <div className="p-3 rounded-xl bg-[#111726] border border-slate-800 border-l-2 border-l-rose-500">
                  <span className="text-[10px] text-slate-400 font-bold">High Risk Tools</span>
                  <p className="text-xl font-bold font-outfit text-rose-400 mt-1">4 Active</p>
                </div>
                <div className="p-3 rounded-xl bg-[#111726] border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold">Compliance Score</span>
                  <p className="text-xl font-bold font-outfit text-emerald-400 mt-1">68%</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111726] border border-slate-800 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-2">
                    <tr>
                      <th className="py-2">Vendor Name</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">IT Sanction</th>
                      <th className="py-2">Risk Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    <tr>
                      <td className="py-2 font-bold text-white">DeepSeek Code Assistant</td>
                      <td className="py-2 text-slate-400">AI Tool</td>
                      <td className="py-2"><span className="px-2 py-0.5 rounded text-[10px] bg-fuchsia-500/20 text-fuchsia-400 font-bold">Unapproved</span></td>
                      <td className="py-2 text-rose-400 font-bold">85/100 (High)</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-white">ChatGPT Plus</td>
                      <td className="py-2 text-slate-400">AI Tool</td>
                      <td className="py-2"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">Approved</span></td>
                      <td className="py-2 text-emerald-400 font-bold">20/100 (Low)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA (DUAL READ: ENTERPRISE DEMO + PORTFOLIO SHOWCASE) */}
      <section className="py-20 px-4 sm:px-8 border-t border-slate-800/80 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-[#111726] to-[#0d1322] border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="font-outfit font-extrabold text-2xl sm:text-4xl text-white">
            Ready to Discover & Govern Shadow AI?
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Deploy the full-stack risk scanner, run automated domain detections, and review compliance scores across your software inventory.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-glow-cyan transition-all"
            >
              Launch Live Dashboard
            </button>
            <button
              onClick={() => setDemoModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
            >
              Request Security Demo
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
            Portfolio & Engineering Note: Built as a production-grade full-stack security product featuring React 18, Express, WASM SQLite (sql.js), JWT Auth, and Manifest V3 Chrome Extension integration.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t border-slate-800/80 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Shadow AI & Vendor Risk Scanner. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-cyan-400 transition-colors">Admin Login</Link>
            <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>

      {/* Demo Request Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
            <h3 className="font-outfit font-bold text-lg text-white mb-1">Request Security Demo</h3>
            <p className="text-xs text-slate-400 mb-4">Leave your corporate email for a guided SecOps walk-through.</p>

            {demoSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold text-center">
                ✅ Request received! We will reach out shortly. You can also explore the live dashboard directly.
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="ciso@company.com"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-glow-cyan"
                >
                  Submit Demo Request
                </button>
              </form>
            )}

            <button
              onClick={() => { setDemoModalOpen(false); setDemoSubmitted(false); }}
              className="mt-4 w-full py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
