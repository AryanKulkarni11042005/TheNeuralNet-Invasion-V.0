import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, FileText } from 'lucide-react';
import IncidentTable from '../components/IncidentTable';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { useApi } from '../hooks/useApi';
import { getIncidents } from '../api/mockApi';
import { severityOptions, statusOptions } from '../data/mockData';

export default function Incidents() {
  const [searchParams] = useSearchParams();
  const { data: incidents, loading } = useApi(getIncidents);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  // Sync search state with URL parameter if it changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!incidents) return [];
    return incidents.filter((inc) => {
      const matchSearch =
        !search ||
        inc.title.toLowerCase().includes(search.toLowerCase()) ||
        inc.location.toLowerCase().includes(search.toLowerCase()) ||
        inc.id.toLowerCase().includes(search.toLowerCase());
      const matchSeverity = !severityFilter || inc.severity === severityFilter;
      const matchStatus = !statusFilter || inc.status === statusFilter;
      return matchSearch && matchSeverity && matchStatus;
    });
  }, [incidents, search, severityFilter, statusFilter]);

  if (loading) return <LoadingSpinner text="Loading incidents..." />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            Incidents Log
          </h1>
          <p className="text-sm text-zinc-500 mt-1 ml-[52px]">
            {filtered.length} of {incidents?.length || 0} incidents
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-zinc-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by title, location, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full text-sm text-zinc-300 placeholder:text-zinc-600 outline-none"
          />
        </div>

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-4 py-2.5 text-sm text-zinc-300 appearance-none cursor-pointer"
        >
          <option value="">All Severities</option>
          {severityOptions.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-4 py-2.5 text-sm text-zinc-300 appearance-none cursor-pointer"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <IncidentTable incidents={filtered} onRowClick={setSelected} />

      {/* Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || 'Incident Details'}
      >
        {selected && (
          <div className="space-y-4">
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
          </div>
        )}
      </Modal>
    </div>
  );
}
