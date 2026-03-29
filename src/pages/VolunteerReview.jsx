import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { getIncidents, updateIncident } from '../api/mockApi';

export default function VolunteerReview() {
  const { data: incidents, loading, setData } = useApi(getIncidents, [{ includePending: true }]);
  const [processingId, setProcessingId] = useState(null);

  const pendingReports = useMemo(
    () => (incidents || []).filter((incident) => incident.status === 'pending'),
    [incidents]
  );

  const handleReview = async (id, approved) => {
    setProcessingId(id);
    const result = await updateIncident(id, {
      status: approved ? 'active' : 'rejected',
      reportedBy: approved ? 'Validated by Volunteer' : 'Rejected by Volunteer',
    });
    if (result.ok) {
      setData((prev) => prev.map((item) => (item.id === id ? result.data : item)));
    }
    setProcessingId(null);
  };

  if (loading) return <LoadingSpinner text="Loading validation queue..." />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          Volunteer Validation
        </h1>
        <p className="text-sm text-zinc-500 mt-2 ml-13">
          Review viewer-submitted reports before they enter the incident log.
        </p>
      </div>

      {pendingReports.length === 0 ? (
        <div className="glass-card p-8 text-center text-zinc-300">
          <p className="text-sm">No pending viewer reports at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingReports.map((incident) => (
            <div key={incident.id} className="glass-card p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-zinc-500">{incident.id}</span>
                    <StatusBadge value={incident.status} type="status" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">{incident.title}</h2>
                  <p className="text-sm text-zinc-500">{incident.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={processingId === incident.id}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 transition disabled:opacity-50"
                    onClick={() => handleReview(incident.id, true)}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button
                    type="button"
                    disabled={processingId === incident.id}
                    className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20 transition disabled:opacity-50"
                    onClick={() => handleReview(incident.id, false)}
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Description</p>
                  <p className="text-sm leading-relaxed text-zinc-300">{incident.description || 'No description provided.'}</p>
                </div>
                <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Reported By</p>
                  <p className="text-sm text-zinc-300">{incident.reportedBy}</p>
                  <p className="text-xs text-zinc-500 mt-3">Severity: {incident.severity}</p>
                  <p className="text-xs text-zinc-500 mt-1">Time: {new Date(incident.time).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
