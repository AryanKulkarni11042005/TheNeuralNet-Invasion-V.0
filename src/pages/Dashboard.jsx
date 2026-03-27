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
          <h1 className="text-2xl font-bold text-white">Situation Overview</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Real-time crisis monitoring dashboard</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
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
            <h2 className="text-base font-semibold text-zinc-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Active Incidents
            </h2>
            <span className="text-xs text-zinc-500">{activeIncidents.length} ongoing</span>
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
        <h2 className="text-base font-semibold text-zinc-200 flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-indigo-400" />
          Recent Activity
        </h2>
        <div className="space-y-0">
          {activity?.map((item, i) => (
            <div
              key={item.id}
              className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-white/[0.02] transition"
            >
              <div className="mt-1">
                <ActivityIcon type={item.type} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-300 leading-relaxed">{item.message}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{item.time}</p>
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
    dispatch: 'bg-blue-500/15 text-blue-400',
    escalation: 'bg-red-500/15 text-red-400',
    update: 'bg-zinc-500/15 text-zinc-400',
    resolution: 'bg-emerald-500/15 text-emerald-400',
    new: 'bg-purple-500/15 text-purple-400',
  };

  return (
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${config[type] || config.update}`}>
      <Radio className="w-3.5 h-3.5" />
    </div>
  );
}
