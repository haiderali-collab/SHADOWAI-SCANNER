import React, { useState, useEffect } from 'react';
import { ShieldCheck, EyeOff, Search, RefreshCw, Zap } from 'lucide-react';

const PRESET_DOMAINS = [
  { domain: 'chatgpt.com', toolName: 'ChatGPT Plus', sensitivity: 'High', compliance: true, breach: false, approved: true },
  { domain: 'deepseek.com', toolName: 'DeepSeek Code Assistant', sensitivity: 'High', compliance: false, breach: false, approved: false },
  { domain: 'free-pdf-compressor.net', toolName: 'Free PDF Compressor Online', sensitivity: 'High', compliance: false, breach: true, approved: false },
  { domain: 'claude.ai', toolName: 'Claude AI Workspace', sensitivity: 'High', compliance: true, breach: false, approved: true },
  { domain: 'midjourney.com', toolName: 'Midjourney AI', sensitivity: 'Medium', compliance: false, breach: false, approved: false }
];

export default function HeroRadarScanner() {
  const [inputDomain, setInputDomain] = useState('');
  const [scannedResult, setScannedResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const computeRisk = (item) => {
    let score = 0;
    const sensMap = { High: 35, Medium: 20, Low: 5 };
    score += sensMap[item.sensitivity] || 20;

    if (!item.compliance) score += 25;
    if (item.breach) score += 25;
    if (!item.approved) {
      score += 15;
      if (item.sensitivity === 'High') score += 10;
    }

    const finalScore = Math.min(100, Math.max(0, score));
    let level = 'Low';
    if (finalScore >= 65) level = 'High';
    else if (finalScore >= 30) level = 'Medium';

    return {
      score: finalScore,
      level,
      isShadow: !item.approved
    };
  };

  useEffect(() => {
    handleScan(PRESET_DOMAINS[1]);
  }, []);

  const handleScan = (presetItem = null) => {
    setIsScanning(true);
    setScannedResult(null);

    setTimeout(() => {
      let target;
      if (presetItem) {
        target = presetItem;
        setInputDomain(presetItem.domain);
      } else {
        const query = inputDomain.trim().toLowerCase() || 'unknown-ai-tool.io';
        const found = PRESET_DOMAINS.find(p => p.domain.toLowerCase().includes(query) || query.includes(p.domain.toLowerCase()));

        if (found) {
          target = found;
        } else {
          const isHigh = query.includes('ai') || query.includes('crypto') || query.includes('code');
          target = {
            domain: query,
            toolName: query.split('.')[0].toUpperCase() + ' AI Assistant',
            sensitivity: isHigh ? 'High' : 'Medium',
            compliance: false,
            breach: query.includes('free') || query.includes('bot'),
            approved: false
          };
        }
      }

      const riskInfo = computeRisk(target);
      setScannedResult({ ...target, ...riskInfo });
      setIsScanning(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 rounded-2xl bg-[#0d1322]/90 border border-slate-800 p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background Radar Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />

      {/* Radar Sweep Light Beam Animation */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-tr from-cyan-500/20 to-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Header Widget Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping absolute inset-0" />
            <div className="w-3 h-3 rounded-full bg-cyan-500 relative" />
          </div>
          <span className="font-outfit font-bold text-sm text-slate-200 tracking-normal">
            Live Radar Risk Scanner
          </span>
        </div>

        {/* Separate clean badges without middle dot */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md">
            Risk Engine v1.0
          </span>
          <span className="bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 px-2.5 py-0.5 rounded-md">
            0–100 Scale
          </span>
        </div>
      </div>

      {/* Interactive Scan Input Bar */}
      <div className="relative z-10 mt-5">
        <form onSubmit={(e) => { e.preventDefault(); handleScan(); }} className="flex flex-col sm:flex-row items-stretch gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Enter domain to scan (e.g. claude.ai, deepseek.com, free-pdf.net)..."
              value={inputDomain}
              onChange={(e) => setInputDomain(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-mono rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
          <button
            type="submit"
            disabled={isScanning}
            className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-glow-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning Network...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Run Risk Scan</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Domain Chips */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span className="text-[11px] font-semibold text-slate-500">Quick Test Scans:</span>
          {PRESET_DOMAINS.map((preset) => (
            <button
              key={preset.domain}
              onClick={() => handleScan(preset)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 transition-colors"
            >
              {preset.domain}
            </button>
          ))}
        </div>
      </div>

      {/* Scan Results Panel */}
      <div className="relative z-10 mt-6 min-h-[160px]">
        {isScanning ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-2">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-cyan-400">Evaluating Data Sensitivity & Security Posture...</p>
          </div>
        ) : scannedResult ? (
          <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 shadow-inner">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-900">
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="font-outfit font-bold text-lg text-white">
                    {scannedResult.toolName}
                  </h4>
                  {scannedResult.isShadow ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30 flex items-center gap-1 shadow-glow-purple">
                      <EyeOff className="w-3 h-3" />
                      Unapproved Shadow Tool
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      IT Approved
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Domain: {scannedResult.domain}
                </p>
              </div>

              {/* Score Display */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Computed Risk
                  </span>
                  <span className={`text-2xl font-extrabold font-outfit ${
                    scannedResult.level === 'High' ? 'text-rose-400' :
                    scannedResult.level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {scannedResult.score}/100 ({scannedResult.level})
                  </span>
                </div>
              </div>
            </div>

            {/* Parameter Matrix */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 block">Data Sensitivity</span>
                <span className={`font-bold mt-0.5 block ${scannedResult.sensitivity === 'High' ? 'text-rose-400' : 'text-slate-200'}`}>
                  {scannedResult.sensitivity} (+{scannedResult.sensitivity === 'High' ? '35' : '20'} pts)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 block">SOC2 / GDPR</span>
                <span className={`font-bold mt-0.5 block ${scannedResult.compliance ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {scannedResult.compliance ? 'Certified (+0)' : 'No Cert (+25)'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 block">Breach History</span>
                <span className={`font-bold mt-0.5 block ${scannedResult.breach ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {scannedResult.breach ? 'Reported (+25)' : 'Clean (+0)'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 block">IT Sanction Status</span>
                <span className={`font-bold mt-0.5 block ${scannedResult.approved ? 'text-emerald-400' : 'text-fuchsia-400'}`}>
                  {scannedResult.approved ? 'Approved' : 'Unapproved (+15)'}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
