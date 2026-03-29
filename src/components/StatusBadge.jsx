const severityConfig = {
  critical: {
    bg: '#2A0E0E',
    text: '#E05252',
    border: '#3A1818',
    dot: '#E05252',
  },
  high: {
    bg: '#2A1A0A',
    text: '#B07030',
    border: '#3A2818',
    dot: '#B07030',
  },
  medium: {
    bg: '#2A1A0A',
    text: '#B07030',
    border: '#3A2818',
    dot: '#B07030',
  },
  low: {
    bg: '#1A1515',
    text: '#7A6A6A',
    border: '#221818',
    dot: '#7A6A6A',
  },
};

const statusConfig = {
  active: {
    bg: '#2A1515',
    text: '#C4A9A9',
    border: '#3A2020',
    dot: '#C4A9A9',
  },
  contained: {
    bg: '#2A1515',
    text: '#C4A9A9',
    border: '#3A2020',
    dot: '#C4A9A9',
  },
  monitoring: {
    bg: '#2A1515',
    text: '#C4A9A9',
    border: '#3A2020',
    dot: '#C4A9A9',
  },
  resolved: {
    bg: '#151E15',
    text: '#4A7A4A',
    border: '#1A2A1A',
    dot: '#4A7A4A',
  },
};

export default function StatusBadge({ value, type = 'status' }) {
  const config = type === 'severity' ? severityConfig : statusConfig;
  const style = config[value] || config.low || {};

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: style.dot }}
      />
      {value?.charAt(0).toUpperCase() + value?.slice(1)}
    </span>
  );
}
