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
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#F0EAEA' }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#1E1717' }}
            >
              <FileText className="w-5 h-5" style={{ color: '#9B2C2C' }} />
            </div>
            Incidents Log
          </h1>
          <p className="text-sm mt-1 ml-[52px]" style={{ color: '#7A6A6A' }}>
            {filtered.length} of {incidents?.length || 0} incidents
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div
          className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5"
          style={{ backgroundColor: '#1E1717', border: '1px solid #221818' }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: '#5A4A4A' }} />
          <input
            type="text"
            placeholder="Search by title, location, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full text-sm outline-none"
            style={{ color: '#C4A9A9' }}
          />
        </div>

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded-xl px-4 py-2.5 text-sm appearance-none cursor-pointer"
          style={{ backgroundColor: '#1E1717', border: '1px solid #221818', color: '#C4A9A9' }}
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
          className="rounded-xl px-4 py-2.5 text-sm appearance-none cursor-pointer"
          style={{ backgroundColor: '#1E1717', border: '1px solid #221818', color: '#C4A9A9' }}
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
          </div>
        )}
      </Modal>
    </div>
  );
}
