import { incidents as mockIncidents, stats as mockStats, activityFeed as mockActivity } from '../data/mockData';

const LOCAL_INCIDENTS_KEY = 'rakshanet.localIncidents';
const LOCAL_INCIDENT_TTL = 20 * 60 * 1000; // 20 minutes

// Simulate network delay
const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

const loadLocalIncidents = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_INCIDENTS_KEY);
    if (!raw) return [];
    const saved = JSON.parse(raw);
    const now = Date.now();
    const valid = Array.isArray(saved)
      ? saved.filter((item) => item && item.createdAt && now - item.createdAt < LOCAL_INCIDENT_TTL)
      : [];
    if (valid.length !== (saved?.length ?? 0)) {
      window.localStorage.setItem(LOCAL_INCIDENTS_KEY, JSON.stringify(valid));
    }
    return valid;
  } catch (error) {
    return [];
  }
};

const saveLocalIncidents = (items) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCAL_INCIDENTS_KEY, JSON.stringify(items));
  } catch (error) {
    // ignore localStorage write failures
  }
};

const syncLocalIncidents = (incident) => {
  if (typeof window === 'undefined') return;
  const raw = window.localStorage.getItem(LOCAL_INCIDENTS_KEY);
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    const updated = (Array.isArray(saved) ? saved : []).map((item) =>
      item?.id === incident.id ? { ...item, ...incident, createdAt: item.createdAt } : item
    );
    saveLocalIncidents(updated);
  } catch (error) {
    // ignore
  }
};

// In-memory store (clone so we can mutate)
let incidents = [...loadLocalIncidents(), ...JSON.parse(JSON.stringify(mockIncidents))];

/**
 * GET /incidents
 * Returns all incidents. Supports optional filters.
 */
export async function getIncidents({ severity, status, search, includePending = false } = {}) {
  await delay(500);
  let result = [...incidents].filter(
    (i) => includePending || (i.status !== 'pending' && i.status !== 'rejected')
  );

  if (severity) {
    result = result.filter((i) => i.severity === severity);
  }
  if (status) {
    result = result.filter((i) => i.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q)
    );
  }

  return { data: result, ok: true };
}

/**
 * GET /incidents/:id
 */
export async function getIncidentById(id) {
  await delay(400);
  const incident = incidents.find((i) => i.id === id);
  if (!incident) return { data: null, ok: false, error: 'Incident not found' };
  return { data: { ...incident }, ok: true };
}

/**
 * POST /incidents
 */
export async function createIncident(data) {
  await delay(800);
  const isViewerReport = data.reporterRole === 'viewer';
  const newIncident = {
    id: `INC-${String(incidents.length + 1).padStart(3, '0')}`,
    title: data.title,
    description: data.description || '',
    severity: data.severity || 'medium',
    status: isViewerReport ? 'pending' : 'active',
    location: data.location || 'Unknown',
    time: new Date().toISOString(),
    assignedTo: null,
    reportedBy: data.reportedBy || (isViewerReport ? 'Viewer Submission' : 'Manual Report'),
    image: data.image || null,
  };
  incidents.unshift(newIncident);
  if (typeof window !== 'undefined') {
    const localItems = loadLocalIncidents();
    saveLocalIncidents([{ ...newIncident, createdAt: Date.now() }, ...localItems]);
  }
  return { data: newIncident, ok: true };
}

/**
 * PATCH /incidents/:id
 */
export async function updateIncident(id, updates) {
  await delay(500);
  const index = incidents.findIndex((i) => i.id === id);
  if (index === -1) return { data: null, ok: false, error: 'Incident not found' };
  incidents[index] = { ...incidents[index], ...updates };
  const updatedIncident = { ...incidents[index] };
  syncLocalIncidents(updatedIncident);
  return { data: updatedIncident, ok: true };
}

/**
 * GET /stats
 */
export async function getStats() {
  await delay(400);
  const total = incidents.length;
  const active = incidents.filter((i) => i.status === 'active').length;
  const resolved = incidents.filter((i) => i.status === 'resolved').length;
  const critical = incidents.filter((i) => i.severity === 'critical').length;
  const contained = incidents.filter((i) => i.status === 'contained').length;
  const monitoring = incidents.filter((i) => i.status === 'monitoring').length;
  return { data: { total, active, resolved, critical, contained, monitoring }, ok: true };
}

/**
 * GET /activity
 */
export async function getActivity() {
  await delay(350);
  return { data: [...mockActivity], ok: true };
}
