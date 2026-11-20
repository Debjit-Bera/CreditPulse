// Small reusable UI pieces shared by all pages.
import Icon from './Icon'

// Tailwind needs full class names written out, so tones live in one map.
export const TONES = {
  green: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', solid: 'bg-emerald-500', hex: '#10b981' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', solid: 'bg-amber-500', hex: '#f59e0b' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', solid: 'bg-orange-500', hex: '#f97316' },
  red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', solid: 'bg-red-500', hex: '#ef4444' },
}

export function Badge({ tone = 'green', children }) {
  const t = TONES[tone]
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${t.bg} ${t.text} ${t.border}`}>
      {children}
    </span>
  )
}

export function PageHeader({ step, title, subtitle }) {
  return (
    <div className="mb-6">
      {step && <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-600">Feature {step}</p>}
      <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
    </div>
  )
}

export function Disclaimer() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
      <Icon name="info" size={18} className="mt-0.5 shrink-0" />
      <p>
        <strong>Simulation only.</strong> All scores and predictions here are simulated for learning.
        They are <strong>not</strong> actual bank or credit-bureau decisions.
      </p>
    </div>
  )
}

export function EmptyState({ onGo }) {
  return (
    <div className="card mx-auto mt-10 max-w-lg text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <Icon name="user" size={26} />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Enter your details first</h2>
      <p className="mt-2 text-slate-500">
        CreditPulse needs your income, expenses and loan request once. After that, every feature reuses them.
      </p>
      <button className="btn-primary mt-5" onClick={() => onGo('details')}>
        Go to Your Details
      </button>
    </div>
  )
}

export function Stat({ label, value, sub }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  )
}
