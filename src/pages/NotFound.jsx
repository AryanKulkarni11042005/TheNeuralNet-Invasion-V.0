import { Link } from 'react-router-dom';
import { AlertOctagon, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 animate-fade-in-up">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <AlertOctagon className="w-10 h-10 text-red-400" />
      </div>

      {/* Text */}
      <h1 className="text-6xl font-extrabold text-white mb-2">404</h1>
      <h2 className="text-lg font-semibold text-zinc-400 mb-2">Sector Not Found</h2>
      <p className="text-sm text-zinc-600 text-center max-w-sm mb-8">
        The area you're looking for doesn't exist in the crisis zone or has been cleared.
      </p>

      {/* CTA */}
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
