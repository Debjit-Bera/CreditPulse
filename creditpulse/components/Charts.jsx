// Hand-made SVG / div charts – no chart library needed.

// Semi-circle score meter (0–100)
export function ScoreMeter({ score, color }) {
  return (
    <div className="relative mx-auto w-full max-w-xs">
      <svg viewBox="0 0 200 115" className="w-full">
        {/* grey track */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="16" strokeLinecap="round" />
        {/* coloured progress – pathLength=100 means dasharray is a plain percentage */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${score} 100`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        <text x="20" y="116" fontSize="9" fill="#94a3b8" textAnchor="middle">0</text>
        <text x="180" y="116" fontSize="9" fill="#94a3b8" textAnchor="middle">100</text>
      </svg>
      <div className="absolute inset-x-0 bottom-4 text-center">
        <p className="text-5xl font-extrabold text-slate-900">{score}</p>
        <p className="text-xs font-medium text-slate-500">out of 100</p>
      </div>
    </div>
  )
}

// Donut chart showing two parts (e.g. principal vs interest)
export function DonutChart({ parts }) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1
  let used = 0
  return (
    <svg viewBox="0 0 42 42" className="mx-auto h-48 w-48 -rotate-90">
      <circle cx="21" cy="21" r="15.9155" fill="none" stroke="#e2e8f0" strokeWidth="6" />
      {parts.map((p) => {
        const share = (p.value / total) * 100
        const el = (
          <circle
            key={p.label}
            cx="21" cy="21" r="15.9155" fill="none"
            stroke={p.color} strokeWidth="6"
            strokeDasharray={`${share} ${100 - share}`}
            strokeDashoffset={-used}
          />
        )
        used += share
        return el
      })}
    </svg>
  )
}

// Horizontal bars: items = [{ label, value, max, color, text }]
export function BarList({ items }) {
  return (
    <div className="space-y-4">
      {items.map((it) => (
        <div key={it.label}>
          <div className="mb-1 flex justify-between gap-2 text-sm">
            <span className="font-medium text-slate-700">{it.label}</span>
            <span className="font-semibold text-slate-900">{it.text}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, Math.max(0, (it.value / it.max) * 100))}%`,
                backgroundColor: it.color,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
