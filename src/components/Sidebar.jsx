import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Shield,
  Radio,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/report', label: 'Report Incident', icon: AlertTriangle },
  { to: '/incidents', label: 'Incidents', icon: FileText },
  { to: '/admin', label: 'Command Panel', icon: Shield },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-zinc-800/60 bg-zinc-950/80">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-800/60">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
          <Radio className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">INVASION</h1>
          <p className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">Crisis Control</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/[0.08] text-white shadow-lg shadow-white/[0.02]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-zinc-800/60">
        <div className="glass-card px-3 py-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
            <span className="text-xs font-medium text-zinc-300">System Online</span>
          </div>
          <p className="text-[10px] text-zinc-500">v0.1.0 — Prototype</p>
        </div>
      </div>
    </aside>
  );
}
