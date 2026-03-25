import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu, Radio } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/report': 'Report Incident',
  '/incidents': 'Incidents',
  '/admin': 'Command Panel',
};

const mobileNavItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/report', label: 'Report' },
  { to: '/incidents', label: 'Incidents' },
  { to: '/admin', label: 'Admin' },
];

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Invasion';
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur px-6 py-3.5">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-red-500 to-orange-500">
              <Radio className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-white hidden sm:block">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-zinc-900/80 border border-zinc-800/60 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 w-40 focus:w-56 transition-all duration-300 outline-none"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            OP
          </div>
        </div>
      </header>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-zinc-800/60 bg-zinc-900/95 backdrop-blur px-4 py-3 space-y-1">
          {mobileNavItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-white/[0.08] text-white' : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}
