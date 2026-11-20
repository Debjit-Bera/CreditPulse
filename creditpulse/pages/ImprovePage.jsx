import { useFinance } from '../context/FinanceContext'
import { Badge, Disclaimer, EmptyState, PageHeader } from '../components/ui'
import { BarList } from '../components/Charts'
import { buildRoadmap, getChecks } from '../utils/finance'

const GENERAL_TIPS = [
  'Pay every EMI and bill before the due date – payment history is the biggest real-world factor.',
  'Keep credit-card use below 30% of your limit.',
  'Avoid applying to many lenders in a short time.',
  'Build an emergency fund worth 3 months of expenses.',
]

export default function ImprovePage({ onGo }) {
  const { analysis: a, profile, rate } = useFinance()
  if (!a) return <EmptyState onGo={onGo} />

  const problems = getChecks(profile, a).filter((c) => c.status !== 'pass' && c.tip)
  const road = buildRoadmap(profile, rate)
  const colorFor = (s) => (s >= 75 ? '#10b981' : s >= 55 ? '#f59e0b' : s >= 35 ? '#f97316' : '#ef4444')

  const bars = [
    { label: 'Today', score: a.score },
    ...road.steps.map((s) => ({ label: `After month ${s.month}`, score: s.result.score })),
  ]

  return (
    <div>
      <PageHeader step={3} title="Score Improvement Guidelines" subtitle="Personalized tips and a simple 3-month roadmap based on your numbers." />
      <Disclaimer />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-900">Personalized tips</h2>
          {problems.length === 0 ? (
            <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
              🎉 No weak spots found in this simulation. Keep your habits steady and avoid new debt.
            </p>
          ) : (
            <ul className="space-y-3">
              {problems.map((c) => (
                <li key={c.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="font-semibold text-slate-800">{c.title}</p>
                  <p className="mt-0.5 text-slate-600">💡 {c.tip}</p>
                </li>
              ))}
            </ul>
          )}
          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-900">Good habits for everyone</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
            {GENERAL_TIPS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        <div className="card">
          <h2 className="mb-1 font-bold text-slate-900">Projected score</h2>
          <p className="mb-4 text-sm text-slate-500">If you complete each month's plan (simulated estimate).</p>
          <BarList
            items={bars.map((b) => ({
              label: b.label, value: b.score, max: 100, color: colorFor(b.score), text: `${b.score}/100`,
            }))}
          />
          <p className="mt-4 text-xs text-slate-400">
            Estimate assumes expenses fall by 10–15%, existing EMI falls by ~20% and the loan request is trimmed by 15%.
          </p>
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold text-slate-900">Your 3-month roadmap</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {road.steps.map((s) => (
          <div key={s.month} className="card">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{s.month}</span>
              <Badge tone={s.result.risk.tone}>Score → {s.result.score}</Badge>
            </div>
            <h3 className="font-bold text-slate-900">Month {s.month}: {s.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {s.actions.map((act) => (
                <li key={act} className="flex gap-2"><span className="text-indigo-500">✔</span><span>{act}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => onGo('chat')}>Next: Ask the AI Assistant →</button>
        <button className="btn-ghost" onClick={() => onGo('rejection')}>← Back</button>
      </div>
    </div>
  )
}
