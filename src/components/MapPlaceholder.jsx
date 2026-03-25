import { Map } from 'lucide-react';

export default function MapPlaceholder() {
  return (
    <div className="glass-card p-5 h-full min-h-[280px] flex flex-col">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Incident Map</h3>
      <div className="flex-1 rounded-xl bg-zinc-800/40 border border-zinc-700/30 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
        {/* Fake map grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Animated pings for incidents */}
        <div className="absolute top-[25%] left-[30%] w-3 h-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40" />
          <span className="relative inline-flex w-3 h-3 rounded-full bg-red-500" />
        </div>
        <div className="absolute top-[45%] left-[60%] w-3 h-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-40" />
          <span className="relative inline-flex w-3 h-3 rounded-full bg-blue-500" />
        </div>
        <div className="absolute top-[65%] left-[40%] w-3 h-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-40" />
          <span className="relative inline-flex w-3 h-3 rounded-full bg-yellow-500" />
        </div>
        <div className="absolute top-[35%] left-[75%] w-2.5 h-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
          <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>

        <Map className="w-10 h-10 text-zinc-600 z-10" />
        <p className="text-xs text-zinc-500 z-10 font-medium">Live Map — Coming Soon</p>
        <p className="text-[10px] text-zinc-600 z-10">Integrate with Mapbox / Leaflet</p>
      </div>
    </div>
  );
}
