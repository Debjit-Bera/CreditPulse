import { useFinance } from '../context/FinanceContext'
import { Badge, Disclaimer, EmptyState, PageHeader, Stat } from '../components/ui'
import { BarList, ScoreMeter } from '../components/Charts'
import { fmt, pct } from '../utils/finance'

export default function ScorePage({ onGo }) {
  const { analysis: a, profile, rate } = useFinance()
  if (!a) return <EmptyState onGo={onGo} />

  const colorFor = (ratio) => (ratio >= 0.75 ? '#10b981' : ratio >= 0.5 ? '#f59e0b' : ratio >= 0.25 ? '#f97316' : '#ef4444')

  return (
    <div>
      <PageHeader step={1} title="Smart Credit Score" subtitle="A simulated score out of 100 built from five simple money ratios." />
      <Disclaimer />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card lg:col-span-2">
          <h2 className="mb-2 text-center font-bold text-slate-900">Your CreditPulse Score</h2>
          <ScoreMeter score={a.score} color={a.risk.hex} />
          <div className="mt-2 text-center">
            <Badge tone={a.risk.tone}>{a.risk.label}</Badge>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-1 text-center text-[11px] font-medium text-slate-500">
            <div className="rounded bg-red-100 py-1 text-red-700">0–34<br />Very High</div>
            <div className="rounded bg-orange-100 py-1 text-orange-700">35–54<br />High</div>
            <div className="rounded bg-amber-100 py-1 text-amber-700">55–74<br />Moderate</div>
            <div className="rounded bg-emerald-100 py-1 text-emerald-700">75–100<br />Low</div>
          </div>
        </div>

        <div className="card lg:col-span-3">
          <h2 className="mb-4 font-bold text-slate-900">Score Breakdown</h2>
          <BarList
            items={a.breakdown.map((b) => ({
              label: b.label,
              value: b.points,
              max: b.max,
              color: colorFor(b.points / b.max),
              text: `${b.points.toFixed(1)} / ${b.max}`,
            }))}
          />
          <ul className="mt-5 space-y-1.5 border-t border-slate-100 pt-4 text-xs text-slate-500">
            {a.breakdown.map((b) => (
              <li key={b.key}>• <span className="font-medium text-slate-600">{b.label}:</span> {b.note}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="New loan EMI" value={fmt(a.newEmi)} sub={`at ${rate}% for ${profile.tenure} months`} />
        <Stat label="Total EMI / income" value={pct(a.foir)} sub="existing + new EMI" />
        <Stat label="Expenses / income" value={pct(a.expenseRatio)} />
        <Stat label="Left each month" value={fmt(a.leftover)} sub="after expenses & EMIs" />
      </div>

      <p className="mt-6 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
        <strong>Note:</strong> Your age is <em>not</em> part of this score. It is only checked for loan-maturity eligibility in feature 2.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => onGo('rejection')}>Next: Why might I be rejected? →</button>
        <button className="btn-ghost" onClick={() => onGo('details')}>Edit details</button>
      </div>
    </div>
  )
}
