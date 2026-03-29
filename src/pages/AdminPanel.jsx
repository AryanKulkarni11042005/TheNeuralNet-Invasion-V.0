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
  const { data: incidents, loading, setData } = useApi(getIncidents, [{ includePending: true }]);
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
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          Command Panel
        </h1>
        <p className="text-sm text-zinc-500 mt-1 ml-[52px]">
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
                <span className="text-xs font-mono text-zinc-500">{inc.id}</span>
                <StatusBadge value={inc.severity} type="severity" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 line-clamp-1 mb-1">{inc.title}</h3>
              <p className="text-xs text-zinc-500">{inc.location}</p>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-2">
              <select
                value={inc.status}
                onChange={(e) => handleStatusChange(inc.id, e.target.value)}
                disabled={updating === inc.id}
                className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs text-zinc-300 appearance-none cursor-pointer disabled:opacity-50"
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
                className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs text-zinc-300 appearance-none cursor-pointer disabled:opacity-50 max-w-[180px]"
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
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              )}
              <button
                onClick={() => setSelected(inc)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition"
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
            <h3 className="text-lg font-bold text-white">{selected.title}</h3>

            <div className="flex flex-wrap gap-2">
              <StatusBadge value={selected.severity} type="severity" />
              <StatusBadge value={selected.status} type="status" />
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-zinc-500">ID:</span>
                <span className="ml-2 text-zinc-300 font-mono">{selected.id}</span>
              </div>
              <div>
                <span className="text-zinc-500">Location:</span>
                <span className="ml-2 text-zinc-300">{selected.location}</span>
              </div>
              <div>
                <span className="text-zinc-500">Assigned To:</span>
                <span className="ml-2 text-zinc-300">{selected.assignedTo || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-zinc-500">Reported By:</span>
                <span className="ml-2 text-zinc-300">{selected.reportedBy}</span>
              </div>
              <div>
                <span className="text-zinc-500">Time:</span>
                <span className="ml-2 text-zinc-300">
                  {new Date(selected.time).toLocaleString()}
                </span>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">Description:</p>
                <p className="text-zinc-300 leading-relaxed">{selected.description}</p>
              </div>
            </div>

            {/* Quick Actions inside modal */}
            <div className="border-t border-zinc-800/60 pt-4 flex flex-wrap gap-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Change Status</label>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                  className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs text-zinc-300 appearance-none cursor-pointer"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Assign Team</label>
                <select
                  value={selected.assignedTo || ''}
                  onChange={(e) => handleAssign(selected.id, e.target.value)}
                  className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs text-zinc-300 appearance-none cursor-pointer"
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
