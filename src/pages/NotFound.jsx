import { Link } from 'react-router-dom';
import { AlertOctagon, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 animate-fade-in-up">
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: '#2A0E0E', border: '1px solid #3A1818' }}
      >
        <AlertOctagon className="w-10 h-10" style={{ color: '#E05252' }} />
      </div>

      {/* Text */}
      <h1 className="text-6xl font-extrabold mb-2" style={{ color: '#F0EAEA' }}>404</h1>
      <h2 className="text-lg font-semibold mb-2" style={{ color: '#C4A9A9' }}>Sector Not Found</h2>
      <p className="text-sm text-center max-w-sm mb-8" style={{ color: '#5A4A4A' }}>
        The area you're looking for doesn't exist in the crisis zone or has been cleared.
      </p>

      {/* CTA */}
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
