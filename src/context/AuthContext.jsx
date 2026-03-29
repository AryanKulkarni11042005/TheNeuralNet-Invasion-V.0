import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ROLE_KEY = 'rakshanet.userRole';
const roles = ['operator', 'viewer', 'volunteer'];
const roleNames = {
  operator: 'Operator',
  viewer: 'Viewer',
  volunteer: 'Volunteer',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRoleState] = useState(() => {
    if (typeof window === 'undefined') return 'viewer';
    const storedRole = localStorage.getItem(ROLE_KEY);
    return roles.includes(storedRole) ? storedRole : 'viewer';
  });

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  const setRole = (nextRole) => {
    if (roles.includes(nextRole)) {
      setRoleState(nextRole);
    }
  };

  const value = useMemo(
    () => ({ role, setRole, roles, roleNames }),
    [role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
