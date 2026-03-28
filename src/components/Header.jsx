import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Bell, Search, Menu, Radio, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getIncidents } from '../api/mockApi';

const pageTitles = {
  '/': 'Dashboard',
  '/report': 'Report Incident',
  '/incidents': 'Incidents',
  '/admin': 'Command Panel',
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'Invasion';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const roleMenuRef = useRef(null);
  const { role, setRole, roles, roleNames } = useAuth();
  const roleAbbrev = role.slice(0, 2).toUpperCase();
  const navItems = [
    { to: '/', label: 'Dashboard' },
    ...(role === 'operator' || role === 'volunteer' ? [{ to: '/report', label: 'Report' }] : []),
    { to: '/incidents', label: 'Incidents' },
    ...(role === 'operator' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  const mobileNavItems = navItems;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        const { data } = await getIncidents({ search: searchQuery });
        setSearchResults(data.slice(0, 3));
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (roleMenuOpen && roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
        setRoleMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [roleMenuOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setSearchResults([]);
      navigate(`/incidents?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const notifications = [
    { id: 1, text: 'New crowd surge detected near CST', time: '2m ago', type: 'alert' },
    { id: 2, text: 'System update: Patch v0.4.2 deployed', time: '1h ago', type: 'info' },
    { id: 3, text: 'Hazmat team Alpha is now on site', time: '2h ago', type: 'update' },
  ];

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-zinc-800/60 bg-zinc-950 px-6 py-3.5 z-100">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/6 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-linear-to-br from-red-500 to-orange-500">
              <Radio className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-white hidden sm:block">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-indigo-500/50 transition-all duration-300">
              <Search className="w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search incidents..."
                className="bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 w-40 focus:w-56 transition-all duration-300 outline-none"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-zinc-800 shadow-2xl rounded-xl overflow-hidden z-1000 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 space-y-1">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        setSearchResults([]);
                        setSearchQuery('');
                        navigate(`/incidents/${result.id}`);
                      }}
                      className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-white/4 transition text-left group"
                    >
                      <div className="mt-1">
                        <AlertCircle className={`w-3.5 h-3.5 ${result.severity === 'critical' ? 'text-red-400' : 'text-zinc-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition truncate">
                          {result.title}
                        </p>
                        <p className="text-[10px] text-zinc-600 truncate">{result.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="bg-white/2 p-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      setSearchResults([]);
                      navigate(`/incidents?q=${encodeURIComponent(searchQuery)}`);
                    }}
                    className="w-full text-[10px] text-zinc-500 hover:text-indigo-400 transition font-medium"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`p-2 rounded-xl transition ${notificationsOpen
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/6'
                }`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-zinc-950" />
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-999"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 z-1000 bg-zinc-950 border border-zinc-800 shadow-2xl rounded-xl p-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-2">
                    <h3 className="text-xs font-semibold text-zinc-300">Notifications</h3>
                    <span className="text-[10px] text-indigo-400 cursor-pointer hover:underline">
                      Mark all as read
                    </span>
                  </div>
                  <div className="space-y-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-lg hover:bg-white/4 transition cursor-pointer group"
                      >
                        <p className="text-xs text-zinc-300 group-hover:text-white transition">
                          {n.text}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5 text-center">
                    <button className="text-[10px] text-zinc-500 hover:text-zinc-300 transition">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative flex flex-col items-center" ref={roleMenuRef}>
            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white transition hover:scale-[1.03]"
              onClick={() => setRoleMenuOpen((open) => !open)}
              title={`Change role (current: ${roleNames[role]})`}
            >
              {roleAbbrev}
            </button>
            <span className="mt-1 text-[10px] text-zinc-400 hidden md:block">Change role</span>
            {roleMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
                {roles.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`w-full px-3 py-2 text-left text-sm transition ${
                      option === role
                        ? 'bg-white/10 text-white'
                        : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => {
                      setRole(option);
                      setRoleMenuOpen(false);
                    }}
                  >
                    {roleNames[option]}
                  </button>
                ))}
              </div>
            )}
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
                `block px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'bg-white/8 text-white' : 'text-zinc-400 hover:text-white'
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
