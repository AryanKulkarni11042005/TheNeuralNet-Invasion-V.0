import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Shield,
  Radio,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const baseNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/report', label: 'Report Incident', icon: AlertTriangle },
  { to: '/incidents', label: 'Incidents', icon: FileText },
  { to: '/admin', label: 'Command Panel', icon: Shield },
];

export default function Sidebar() {
  const { role } = useAuth();

  const navItems = baseNavItems.filter((item) => {
    if (item.to === '/report' && !(role === 'operator' || role === 'volunteer')) {
      return false;
    }
    if (item.to === '/admin' && role !== 'operator') {
      return false;
    }
    return true;
  });

  return (
    <aside
      className="hidden lg:flex w-64 flex-col"
      style={{ backgroundColor: '#111010', borderRight: '1px solid #221818' }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-6 py-5"
        style={{ borderBottom: '1px solid #221818' }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ backgroundColor: '#7A1818' }}
        >
          <Radio className="w-5 h-5" style={{ color: '#F0EAEA' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight" style={{ color: '#F0EAEA' }}>INVASION</h1>
          <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: '#5A4A4A' }}>Crisis Control</p>
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
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200`
            }
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: '#2A1515', color: '#C4A9A9' }
                : { color: '#7A6A6A' }
            }
          >
            <Icon className="w-4.5 h-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid #221818' }}>
        <div className="glass-card px-3 py-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-2 h-2 rounded-full animate-pulse-dot"
              style={{ backgroundColor: '#4A7A4A' }}
            />
            <span className="text-xs font-medium" style={{ color: '#C4A9A9' }}>System Online</span>
          </div>
          <p className="text-[10px]" style={{ color: '#3A2A2A' }}>v0.1.0 — Prototype</p>
        </div>
      </div>
    </aside>
  );
}
