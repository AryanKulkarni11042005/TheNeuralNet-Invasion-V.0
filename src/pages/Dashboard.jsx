import { useEffect } from 'react';
import {
  AlertTriangle,
  Activity,
  CheckCircle2,
  Flame,
  Clock,
  ArrowUpRight,
  Radio,
  Zap,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import IncidentCard from '../components/IncidentCard';
import IncidentMap from '../components/IncidentMap';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { useApi } from '../hooks/useApi';
import { getStats, getIncidents, getActivity } from '../api/mockApi';

export default function Dashboard() {
  const { data: stats, loading: statsLoading } = useApi(getStats);
  const { data: incidents, loading: incLoading } = useApi(getIncidents);
  const { data: activity, loading: actLoading } = useApi(getActivity);

  if (statsLoading || incLoading || actLoading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const activeIncidents = incidents?.filter((i) => i.status === 'active') || [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#F0EAEA' }}>Situation Overview</h1>
          <p className="text-sm mt-0.5" style={{ color: '#7A6A6A' }}>Real-time crisis monitoring dashboard</p>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#7A6A6A' }}>
          <span
            className="w-2 h-2 rounded-full animate-pulse-dot"
            style={{ backgroundColor: '#4A7A4A' }}
          />
          Live — Last updated just now
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Incidents"
          value={stats?.total || 0}
          icon={Activity}
          color="blue"
          trend={8}
        />
        <StatCard
          label="Active"
          value={stats?.active || 0}
          icon={Zap}
          color="orange"
          trend={12}
        />
        <StatCard
          label="Critical"
          value={stats?.critical || 0}
          icon={Flame}
          color="red"
          trend={-5}
        />
        <StatCard
          label="Resolved"
          value={stats?.resolved || 0}
          icon={CheckCircle2}
          color="green"
          trend={-15}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Incidents */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: '#C4A9A9' }}>
              <AlertTriangle className="w-4 h-4" style={{ color: '#E05252' }} />
              Active Incidents
            </h2>
            <span className="text-xs" style={{ color: '#7A6A6A' }}>{activeIncidents.length} ongoing</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeIncidents.slice(0, 4).map((inc) => (
              <IncidentCard key={inc.id} incident={inc} />
            ))}
          </div>
        </div>

        {/* Map */}
        <div>
          <IncidentMap />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-5">
        <h2 className="text-base font-semibold flex items-center gap-2 mb-4" style={{ color: '#C4A9A9' }}>
          <Clock className="w-4 h-4" style={{ color: '#9B2C2C' }} />
          Recent Activity
        </h2>
        <div className="space-y-0">
          {activity?.map((item, i) => (
            <div
              key={item.id}
              className="flex items-start gap-3 px-3 py-3 rounded-lg transition"
            >
              <div className="mt-1">
                <ActivityIcon type={item.type} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed" style={{ color: '#C4A9A9' }}>{item.message}</p>
                <p className="text-xs mt-0.5" style={{ color: '#5A4A4A' }}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityIcon({ type }) {
  const config = {
    dispatch: { bg: '#1E1717', text: '#C4A9A9' },
    escalation: { bg: '#2A0E0E', text: '#E05252' },
    update: { bg: '#1A1515', text: '#7A6A6A' },
    resolution: { bg: '#151E15', text: '#4A7A4A' },
    new: { bg: '#1E1717', text: '#9B2C2C' },
  };

  const c = config[type] || config.update;

  return (
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <Radio className="w-3.5 h-3.5" />
    </div>
  );
}
