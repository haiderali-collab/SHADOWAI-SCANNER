import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Server, ShieldAlert, FileText, Lock } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { to: '/dashboard/vendors', label: 'Vendor Directory', icon: Server },
    { to: '/dashboard/alerts', label: 'Risk & Shadow Alerts', icon: ShieldAlert },
    { to: '/dashboard/reports', label: 'Security Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0d1322] border-r border-slate-200 dark:border-slate-800/80 hidden lg:flex flex-col justify-between shrink-0 p-4 transition-colors">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Navigation Hub
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Security Status Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Active Risk Engine</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Real-time compliance validation & unapproved tool detection active.
          </p>
        </div>
      </div>

      {/* Footer metadata */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-400 text-center">
        <p>Shadow AI Scanner v1.0</p>
        <p className="text-[10px] text-slate-500">SQLite Local DB Powered</p>
      </div>
    </aside>
  );
}
