import { MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function IncidentCard({ incident, onClick }) {
  const timeAgo = getTimeAgo(incident.time);

  return (
    <div
      onClick={() => onClick?.(incident)}
      className="glass-card p-4 cursor-pointer group animate-fade-in-up"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
          {incident.title}
        </h3>
        <StatusBadge value={incident.severity} type="severity" />
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
        <MapPin className="w-3 h-3" />
        <span>{incident.location}</span>
      </div>

      <div className="flex items-center justify-between">
        <StatusBadge value={incident.status} type="status" />
        <span className="text-[11px] text-zinc-600">{timeAgo}</span>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
