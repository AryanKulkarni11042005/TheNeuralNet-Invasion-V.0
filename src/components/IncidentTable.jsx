import StatusBadge from './StatusBadge';

export default function IncidentTable({ incidents, onRowClick }) {
  return (
    <div
      className="overflow-x-auto rounded-2xl"
      style={{ border: '1px solid #221818', backgroundColor: '#1A1515' }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid #221818' }}>
            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#7A6A6A' }}>ID</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#7A6A6A' }}>Incident</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: '#7A6A6A' }}>Location</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#7A6A6A' }}>Severity</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#7A6A6A' }}>Status</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: '#7A6A6A' }}>Assigned</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc, i) => (
            <tr
              key={inc.id}
              onClick={() => onRowClick?.(inc)}
              className="cursor-pointer transition-colors"
              style={{
                borderBottom: '1px solid rgba(34, 24, 24, 0.6)',
                backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(17, 16, 16, 0.3)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E1717')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'transparent' : 'rgba(17, 16, 16, 0.3)')}
            >
              <td className="px-5 py-3.5 font-mono text-xs" style={{ color: '#5A4A4A' }}>{inc.id}</td>
              <td className="px-5 py-3.5">
                <span className="font-medium line-clamp-1" style={{ color: '#C4A9A9' }}>{inc.title}</span>
              </td>
              <td className="px-5 py-3.5 hidden md:table-cell" style={{ color: '#7A6A6A' }}>{inc.location}</td>
              <td className="px-5 py-3.5">
                <StatusBadge value={inc.severity} type="severity" />
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge value={inc.status} type="status" />
              </td>
              <td className="px-5 py-3.5 hidden lg:table-cell" style={{ color: '#7A6A6A' }}>{inc.assignedTo || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {incidents.length === 0 && (
        <div className="text-center py-12" style={{ color: '#7A6A6A' }}>
          No incidents match your filters.
        </div>
      )}
    </div>
  );
}
