import { Map } from 'lucide-react';

export default function MapPlaceholder() {
  return (
    <div className="glass-card p-5 h-full min-h-[280px] flex flex-col">
      <h3 className="text-sm font-semibold mb-3" style={{ color: '#C4A9A9' }}>Incident Map</h3>
      <div
        className="flex-1 rounded-xl flex flex-col items-center justify-center gap-3 relative overflow-hidden"
        style={{ backgroundColor: '#111010', border: '1px solid #221818' }}
      >
        {/* Fake map grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(155,44,44,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(155,44,44,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Animated pings for incidents */}
        <div className="absolute top-[25%] left-[30%] w-3 h-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" style={{ backgroundColor: '#E05252' }} />
          <span className="relative inline-flex w-3 h-3 rounded-full" style={{ backgroundColor: '#9B2C2C' }} />
        </div>
        <div className="absolute top-[45%] left-[60%] w-3 h-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" style={{ backgroundColor: '#C4A9A9' }} />
          <span className="relative inline-flex w-3 h-3 rounded-full" style={{ backgroundColor: '#7A6A6A' }} />
        </div>
        <div className="absolute top-[65%] left-[40%] w-3 h-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" style={{ backgroundColor: '#B07030' }} />
          <span className="relative inline-flex w-3 h-3 rounded-full" style={{ backgroundColor: '#8A5520' }} />
        </div>
        <div className="absolute top-[35%] left-[75%] w-2.5 h-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" style={{ backgroundColor: '#4A7A4A' }} />
          <span className="relative inline-flex w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#4A7A4A' }} />
        </div>

        <Map className="w-10 h-10 z-10" style={{ color: '#5A4A4A' }} />
        <p className="text-xs z-10 font-medium" style={{ color: '#7A6A6A' }}>Live Map — Coming Soon</p>
        <p className="text-[10px] z-10" style={{ color: '#5A4A4A' }}>Integrate with Mapbox / Leaflet</p>
      </div>
    </div>
  );
}
