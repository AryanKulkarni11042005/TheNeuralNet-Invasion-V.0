import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center py-28 px-4 animate-fade-in-up">
      <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
        <ShieldAlert className="w-10 h-10 text-amber-400" />
      </div>
      <h1 className="text-5xl font-extrabold text-white mb-2">Access Denied</h1>
      <p className="text-sm text-zinc-500 text-center max-w-md mb-8">
        Your current role does not have permission to open that section. Switch your role to gain access or return to the safe zone.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
      >
        <Home className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
