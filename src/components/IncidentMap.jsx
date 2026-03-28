import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default Leaflet marker icons in bundlers (Vite/React)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MUMBAI_CENTER = [19.076, 72.8777];

const INCIDENTS = [
  {
    id: 1,
    type: 'Crowd Alert',
    title: 'Crowd surge near CST Station',
    description: 'Large crowd detected, monitoring density and movement.',
    position: [19.0099, 72.8429],
  },
  {
    id: 2,
    type: 'Network Outage',
    title: 'Cell network disruption - Andheri',
    description: 'Partial outage affecting voice and data services.',
    position: [19.1197, 72.8468],
  },
  {
    id: 3,
    type: 'Emergency',
    title: 'Fire incident - Lower Parel',
    description: 'Emergency response teams dispatched to the scene.',
    position: [18.9937, 72.8304],
  },
  {
    id: 4,
    type: 'Crowd Alert',
    title: 'Protest gathering - Azad Maidan',
    description: 'Peaceful assembly, monitoring for escalation.',
    position: [18.9402, 72.8355],
  },
];

export default function IncidentMap() {
  return (
    <div className="glass-card p-5 h-full min-h-[280px] flex flex-col">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Incident Map</h3>

      <div className="flex-1 rounded-xl bg-zinc-900/70 border border-zinc-700/60 overflow-hidden">
        <MapContainer
          center={MUMBAI_CENTER}
          zoom={11}
          scrollWheelZoom
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {INCIDENTS.map((incident) => (
            <Marker key={incident.id} position={incident.position}>
              <Popup>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white-100">
                    {incident.title}
                  </p>
                  <p className="text-[11px] text-white-400">
                    {incident.description}
                  </p>
                  <p className="text-[10px] text-indigo-400 font-medium mt-1">
                    {incident.type}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
