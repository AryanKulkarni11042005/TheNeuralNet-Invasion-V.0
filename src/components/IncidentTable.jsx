import StatusBadge from './StatusBadge';

export default function IncidentTable({ incidents, onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800/60 bg-zinc-900/30">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800/60">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">ID</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Incident</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Location</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Severity</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden lg:table-cell">Assigned</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc, i) => (
            <tr
              key={inc.id}
              onClick={() => onRowClick?.(inc)}
              className={`border-b border-zinc-800/40 cursor-pointer transition-colors hover:bg-white/[0.03] ${
                i % 2 === 0 ? 'bg-transparent' : 'bg-zinc-900/20'
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <td className="px-5 py-3.5 font-mono text-xs text-zinc-500">{inc.id}</td>
              <td className="px-5 py-3.5">
                <span className="text-zinc-200 font-medium line-clamp-1">{inc.title}</span>
              </td>
              <td className="px-5 py-3.5 text-zinc-400 hidden md:table-cell">{inc.location}</td>
              <td className="px-5 py-3.5">
                <StatusBadge value={inc.severity} type="severity" />
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge value={inc.status} type="status" />
              </td>
              <td className="px-5 py-3.5 text-zinc-400 hidden lg:table-cell">{inc.assignedTo || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {incidents.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          No incidents match your filters.
        </div>
      )}
    </div>
  );
}
