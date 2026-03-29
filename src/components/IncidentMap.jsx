import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MUMBAI_CENTER = [19.076, 72.8777];

const INCIDENTS = [
  {
    id: 1,
    type: 'Crowd Alert',
    title: 'Crowd surge near CST Station',
    description: 'Large crowd detected, monitoring density and movement.',
    position: [19.0099, 72.8429],
    color: '#E05252',
  },
  {
    id: 2,
    type: 'Network Outage',
    title: 'Cell network disruption - Andheri',
    description: 'Partial outage affecting voice and data services.',
    position: [19.1197, 72.8468],
    color: '#B07030',
  },
  {
    id: 3,
    type: 'Emergency',
    title: 'Fire incident - Lower Parel',
    description: 'Emergency response teams dispatched to the scene.',
    position: [18.9937, 72.8304],
    color: '#E05252',
  },
  {
    id: 4,
    type: 'Crowd Alert',
    title: 'Protest gathering - Azad Maidan',
    description: 'Peaceful assembly, monitoring for escalation.',
    position: [18.9402, 72.8355],
    color: '#9B2C2C',
  },
];

export default function IncidentMap() {
  return (
    <div className="glass-card p-5 h-full min-h-[280px] flex flex-col">
      <h3 className="text-sm font-semibold mb-3" style={{ color: '#C4A9A9' }}>Incident Map</h3>

      <div
        className="flex-1 rounded-xl overflow-hidden"
        style={{ backgroundColor: '#111010', border: '1px solid #221818' }}
      >
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
            <CircleMarker
              key={incident.id}
              center={incident.position}
              radius={8}
              pathOptions={{
                fillColor: incident.color,
                fillOpacity: 0.85,
                color: incident.color,
                weight: 2,
                opacity: 0.5,
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="text-xs font-semibold" style={{ color: '#F0EAEA' }}>
                    {incident.title}
                  </p>
                  <p className="text-[11px]" style={{ color: '#C4A9A9' }}>
                    {incident.description}
                  </p>
                  <p className="text-[10px] font-medium mt-1" style={{ color: '#9B2C2C' }}>
                    {incident.type}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
