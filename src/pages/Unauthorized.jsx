import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center py-28 px-4 animate-fade-in-up">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: '#2A1A0A', border: '1px solid #3A2818' }}
      >
        <ShieldAlert className="w-10 h-10" style={{ color: '#B07030' }} />
      </div>
      <h1 className="text-5xl font-extrabold mb-2" style={{ color: '#F0EAEA' }}>Access Denied</h1>
      <p className="text-sm text-center max-w-md mb-8" style={{ color: '#7A6A6A' }}>
        Your current role does not have permission to open that section. Switch your role to gain access or return to the safe zone.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl transition-all"
        style={{ backgroundColor: '#9B2C2C', color: '#F0EAEA' }}
      >
        <Home className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
