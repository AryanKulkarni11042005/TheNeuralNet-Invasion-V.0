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
      <header
        className="flex items-center justify-between gap-4 px-6 py-3.5 z-100"
        style={{ backgroundColor: '#111010', borderBottom: '1px solid #221818' }}
      >
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg transition"
            style={{ color: '#7A6A6A' }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-md"
              style={{ backgroundColor: '#7A1818' }}
            >
              <Radio className="w-4 h-4" style={{ color: '#F0EAEA' }} />
            </div>
          </div>
          <h2 className="text-lg font-semibold hidden sm:block" style={{ color: '#F0EAEA' }}>{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-300"
              style={{ backgroundColor: '#1E1717', border: '1px solid #221818' }}
            >
              <Search className="w-4 h-4" style={{ color: '#5A4A4A' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search incidents..."
                className="bg-transparent text-sm w-40 focus:w-56 transition-all duration-300 outline-none"
                style={{ color: '#C4A9A9', '::placeholder': { color: '#5A4A4A' } }}
              />
            </div>

            {searchResults.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 shadow-2xl rounded-xl overflow-hidden z-1000 animate-in fade-in slide-in-from-top-2 duration-200"
                style={{ backgroundColor: '#111010', border: '1px solid #221818' }}
              >
                <div className="p-2 space-y-1">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        setSearchResults([]);
                        setSearchQuery('');
                        navigate(`/incidents/${result.id}`);
                      }}
                      className="w-full flex items-start gap-3 p-2 rounded-lg transition text-left group"
                      style={{ ':hover': { backgroundColor: '#1E1717' } }}
                    >
                      <div className="mt-1">
                        <AlertCircle
                          className="w-3.5 h-3.5"
                          style={{ color: result.severity === 'critical' ? '#E05252' : '#5A4A4A' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium transition truncate" style={{ color: '#C4A9A9' }}>
                          {result.title}
                        </p>
                        <p className="text-[10px] truncate" style={{ color: '#5A4A4A' }}>{result.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-2" style={{ borderTop: '1px solid #221818', backgroundColor: '#1A1515' }}>
                  <button
                    onClick={() => {
                      setSearchResults([]);
                      navigate(`/incidents?q=${encodeURIComponent(searchQuery)}`);
                    }}
                    className="w-full text-[10px] transition font-medium"
                    style={{ color: '#7A6A6A' }}
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
              className="p-2 rounded-xl transition"
              style={{
                backgroundColor: notificationsOpen ? '#2A1515' : 'transparent',
                color: notificationsOpen ? '#C4A9A9' : '#7A6A6A',
              }}
            >
              <Bell className="w-5 h-5" />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: '#E05252', border: '2px solid #111010' }}
              />
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-999"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-80 z-1000 shadow-2xl rounded-xl p-2 animate-in fade-in zoom-in duration-200 origin-top-right"
                  style={{ backgroundColor: '#111010', border: '1px solid #221818' }}
                >
                  <div
                    className="flex items-center justify-between px-3 py-2 mb-2"
                    style={{ borderBottom: '1px solid #221818' }}
                  >
                    <h3 className="text-xs font-semibold" style={{ color: '#C4A9A9' }}>Notifications</h3>
                    <span className="text-[10px] cursor-pointer hover:underline" style={{ color: '#9B2C2C' }}>
                      Mark all as read
                    </span>
                  </div>
                  <div className="space-y-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-lg transition cursor-pointer group"
                      >
                        <p className="text-xs transition" style={{ color: '#C4A9A9' }}>
                          {n.text}
                        </p>
                        <p className="text-[10px] mt-1" style={{ color: '#5A4A4A' }}>{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 text-center" style={{ borderTop: '1px solid #221818' }}>
                    <button className="text-[10px] transition" style={{ color: '#7A6A6A' }}>
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
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition hover:scale-[1.03]"
              onClick={() => setRoleMenuOpen((open) => !open)}
              title={`Change role (current: ${roleNames[role]})`}
              style={{ backgroundColor: '#9B2C2C', color: '#F0EAEA' }}
            >
              {roleAbbrev}
            </button>
            <span className="mt-1 text-[10px] hidden md:block" style={{ color: '#7A6A6A' }}>Change role</span>
            {roleMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-2xl shadow-2xl"
                style={{ border: '1px solid #221818', backgroundColor: '#111010' }}
              >
                {roles.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm transition"
                    style={{
                      backgroundColor: option === role ? '#2A1515' : 'transparent',
                      color: option === role ? '#C4A9A9' : '#7A6A6A',
                    }}
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
        <div
          className="lg:hidden backdrop-blur px-4 py-3 space-y-1"
          style={{ borderBottom: '1px solid #221818', backgroundColor: 'rgba(26, 21, 21, 0.95)' }}
        >
          {mobileNavItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium transition"
              style={({ isActive }) =>
                isActive
                  ? { backgroundColor: '#2A1515', color: '#C4A9A9' }
                  : { color: '#7A6A6A' }
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
