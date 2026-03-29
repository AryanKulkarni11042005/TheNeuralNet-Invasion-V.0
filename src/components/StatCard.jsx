export default function StatCard({ label, value, icon: Icon, color = 'blue', trend }) {
  const colorMap = {
    blue: { bg: '#1A1515', border: '#221818', text: '#C4A9A9' },
    red: { bg: '#1E1212', border: '#2A1818', text: '#E05252' },
    green: { bg: '#151E15', border: '#1A2A1A', text: '#4A7A4A' },
    yellow: { bg: '#1E1A12', border: '#2A2218', text: '#B07030' },
    purple: { bg: '#1A1515', border: '#221818', text: '#C4A9A9' },
    orange: { bg: '#1E1A12', border: '#2A2218', text: '#B07030' },
  };

  const iconBgMap = {
    blue: { bg: '#1E1717', text: '#C4A9A9' },
    red: { bg: '#2A0E0E', text: '#E05252' },
    green: { bg: '#151E15', text: '#4A7A4A' },
    yellow: { bg: '#2A1A0A', text: '#B07030' },
    purple: { bg: '#1E1717', text: '#C4A9A9' },
    orange: { bg: '#2A1A0A', text: '#B07030' },
  };

  const c = colorMap[color] || colorMap.blue;
  const ic = iconBgMap[color] || iconBgMap.blue;

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.02]"
      style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: '#7A6A6A' }}>{label}</p>
          <p className="mt-2 text-3xl font-bold" style={{ color: '#F0EAEA' }}>{value}</p>
          {trend && (
            <p className="mt-1 text-xs font-medium" style={{ color: trend > 0 ? '#9B3030' : '#4A7A4A' }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from yesterday
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-xl p-2.5" style={{ backgroundColor: ic.bg, color: ic.text }}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl" style={{ backgroundColor: 'rgba(155, 44, 44, 0.03)' }} />
    </div>
  );
}
