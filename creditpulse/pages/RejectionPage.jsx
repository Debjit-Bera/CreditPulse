import { useFinance } from '../context/FinanceContext'
import { Badge, Disclaimer, EmptyState, PageHeader, TONES } from '../components/ui'
import Icon from '../components/Icon'
import { getChecks, getVerdict } from '../utils/finance'

const STATUS = {
  pass: { icon: 'check', label: 'Looks fine', tone: 'green' },
  warn: { icon: 'alert', label: 'Needs attention', tone: 'amber' },
  fail: { icon: 'xcircle', label: 'Likely reason for rejection', tone: 'red' },
}

export default function RejectionPage({ onGo }) {
  const { analysis: a, profile } = useFinance()
  if (!a) return <EmptyState onGo={onGo} />

  const checks = getChecks(profile, a)
  const verdict = getVerdict(a, checks)
  const t = TONES[verdict.tone]
  // show problems first
  const order = { fail: 0, warn: 1, pass: 2 }
  const sorted = [...checks].sort((x, y) => order[x.status] - order[y.status])

  return (
    <div>
      <PageHeader step={2} title="Why Was My Loan Rejected?" subtitle="Six simple checks that mimic what a lender looks at." />
      <Disclaimer />

      <div className={`card mb-6 border-2 ${t.border} ${t.bg}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Simulated verdict</p>
            <p className={`text-2xl font-extrabold ${t.text}`}>{verdict.label}</p>
            <p className="mt-1 text-sm text-slate-600">{verdict.text}</p>
          </div>
          <div className="flex gap-2 text-center text-sm font-semibold">
            <div className="rounded-xl bg-white px-4 py-2 text-red-600">{verdict.fails}<br /><span className="text-xs font-medium text-slate-500">issues</span></div>
            <div className="rounded-xl bg-white px-4 py-2 text-amber-600">{verdict.warns}<br /><span className="text-xs font-medium text-slate-500">warnings</span></div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((c) => {
          const s = STATUS[c.status]
          const tone = TONES[s.tone]
          return (
            <div key={c.id} className={`card flex gap-4 !p-4 ${c.status === 'pass' ? '' : `border-l-4 ${tone.border}`}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone.bg} ${tone.text}`}>
                <Icon name={s.icon} size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-slate-900">{c.title}</h3>
                  <Badge tone={s.tone}>{s.label}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{c.detail}</p>
                {c.status !== 'pass' && c.tip && (
                  <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">💡 {c.tip}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => onGo('improve')}>Next: How do I improve? →</button>
        <button className="btn-ghost" onClick={() => onGo('score')}>← Back to score</button>
      </div>
    </div>
  )
}
