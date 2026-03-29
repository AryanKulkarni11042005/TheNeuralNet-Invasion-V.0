import { useState } from 'react';
import {
  Shield,
  Users,
  Eye,
  ChevronDown,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { useApi } from '../hooks/useApi';
import { getIncidents, updateIncident } from '../api/mockApi';
import { teams, statusOptions } from '../data/mockData';

export default function AdminPanel() {
  const { data: incidents, loading, setData } = useApi(getIncidents);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null); // incident id being updated

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    const result = await updateIncident(id, { status: newStatus });
    if (result.ok) {
      setData((prev) => prev.map((i) => (i.id === id ? result.data : i)));
      if (selected?.id === id) setSelected(result.data);
    }
    setUpdating(null);
  };

  const handleAssign = async (id, team) => {
    setUpdating(id);
    const result = await updateIncident(id, { assignedTo: team });
    if (result.ok) {
      setData((prev) => prev.map((i) => (i.id === id ? result.data : i)));
      if (selected?.id === id) setSelected(result.data);
    }
    setUpdating(null);
  };

  if (loading) return <LoadingSpinner text="Loading command panel..." />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#F0EAEA' }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#1E1717' }}
          >
            <Shield className="w-5 h-5" style={{ color: '#9B2C2C' }} />
          </div>
          Command Panel
        </h1>
        <p className="text-sm mt-1 ml-[52px]" style={{ color: '#7A6A6A' }}>
          Manage incidents, assign teams, and update statuses
        </p>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {incidents?.map((inc) => (
          <div
            key={inc.id}
            className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono" style={{ color: '#5A4A4A' }}>{inc.id}</span>
                <StatusBadge value={inc.severity} type="severity" />
              </div>
              <h3 className="text-sm font-semibold line-clamp-1 mb-1" style={{ color: '#C4A9A9' }}>{inc.title}</h3>
              <p className="text-xs" style={{ color: '#5A4A4A' }}>{inc.location}</p>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-2">
              <select
                value={inc.status}
                onChange={(e) => handleStatusChange(inc.id, e.target.value)}
                disabled={updating === inc.id}
                className="rounded-lg px-3 py-2 text-xs appearance-none cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: '#1E1717', border: '1px solid #221818', color: '#C4A9A9' }}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Selector */}
            <div className="flex items-center gap-2">
              <select
                value={inc.assignedTo || ''}
                onChange={(e) => handleAssign(inc.id, e.target.value)}
                disabled={updating === inc.id}
                className="rounded-lg px-3 py-2 text-xs appearance-none cursor-pointer disabled:opacity-50 max-w-[180px]"
                style={{ backgroundColor: '#1E1717', border: '1px solid #221818', color: '#C4A9A9' }}
              >
                <option value="">Assign Team</option>
                {teams.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {updating === inc.id && (
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#9B2C2C' }} />
              )}
              <button
                onClick={() => setSelected(inc)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition"
                style={{ color: '#9B2C2C', backgroundColor: '#2A0E0E', border: '1px solid #3A1818' }}
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Incident Details"
      >
        {selected && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold" style={{ color: '#F0EAEA' }}>{selected.title}</h3>

            <div className="flex flex-wrap gap-2">
              <StatusBadge value={selected.severity} type="severity" />
              <StatusBadge value={selected.status} type="status" />
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span style={{ color: '#7A6A6A' }}>ID:</span>
                <span className="ml-2 font-mono" style={{ color: '#C4A9A9' }}>{selected.id}</span>
              </div>
              <div>
                <span style={{ color: '#7A6A6A' }}>Location:</span>
                <span className="ml-2" style={{ color: '#C4A9A9' }}>{selected.location}</span>
              </div>
              <div>
                <span style={{ color: '#7A6A6A' }}>Assigned To:</span>
                <span className="ml-2" style={{ color: '#C4A9A9' }}>{selected.assignedTo || 'Unassigned'}</span>
              </div>
              <div>
                <span style={{ color: '#7A6A6A' }}>Reported By:</span>
                <span className="ml-2" style={{ color: '#C4A9A9' }}>{selected.reportedBy}</span>
              </div>
              <div>
                <span style={{ color: '#7A6A6A' }}>Time:</span>
                <span className="ml-2" style={{ color: '#C4A9A9' }}>
                  {new Date(selected.time).toLocaleString()}
                </span>
              </div>
              <div>
                <p className="mb-1" style={{ color: '#7A6A6A' }}>Description:</p>
                <p className="leading-relaxed" style={{ color: '#C4A9A9' }}>{selected.description}</p>
              </div>
            </div>

            {/* Quick Actions inside modal */}
            <div className="pt-4 flex flex-wrap gap-3" style={{ borderTop: '1px solid #221818' }}>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#7A6A6A' }}>Change Status</label>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                  className="rounded-lg px-3 py-2 text-xs appearance-none cursor-pointer"
                  style={{ backgroundColor: '#1E1717', border: '1px solid #221818', color: '#C4A9A9' }}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#7A6A6A' }}>Assign Team</label>
                <select
                  value={selected.assignedTo || ''}
                  onChange={(e) => handleAssign(selected.id, e.target.value)}
                  className="rounded-lg px-3 py-2 text-xs appearance-none cursor-pointer"
                  style={{ backgroundColor: '#1E1717', border: '1px solid #221818', color: '#C4A9A9' }}
                >
                  <option value="">Unassigned</option>
                  {teams.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
