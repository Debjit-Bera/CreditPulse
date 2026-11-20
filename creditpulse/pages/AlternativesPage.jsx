import { useFinance } from '../context/FinanceContext'
import { Badge, Disclaimer, EmptyState, PageHeader, TONES } from '../components/ui'
import { BarList } from '../components/Charts'
import { buildAlternatives, fmt, pct } from '../utils/finance'

export default function AlternativesPage({ onGo }) {
  const { analysis: a, profile, rate } = useFinance()
  if (!a) return <EmptyState onGo={onGo} />

  const { options, maxLoanSame, maxByAge } = buildAlternatives(profile, rate)
  const best = [...options].sort((x, y) => y.a.score - x.a.score)[0]
  const current = options[0]

  return (
    <div>
      <PageHeader step={5} title="Alternative Loan Suggestions" subtitle="Safer ways to borrow – compare amount, tenure, EMI and simulated score." />
      <Disclaimer />

      <div className="card mb-6 bg-indigo-50 !border-indigo-200">
        <p className="text-sm text-indigo-900">
          {maxLoanSame >= 1000 ? (
            <>
              Based on your income and existing EMI, you could comfortably borrow up to <strong>{fmt(maxLoanSame)}</strong> over{' '}
              <strong>{profile.tenure} months</strong> while keeping total EMIs at 40% of income.
            </>
          ) : (
            <>Your existing EMIs already use most of the safe 40% limit, so there is little room for a new loan. Reduce existing EMIs first.</>
          )}{' '}
          Tenure options are capped so the loan ends before age 65 (max {maxByAge} months for you).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {options.map((o) => {
          const t = TONES[o.verdict.tone]
          const isBest = o.id === best.id && o.id !== 'current'
          return (
            <div key={o.id} className={`card relative ${isBest ? 'ring-2 ring-emerald-400' : ''}`}>
              {isBest && <span className="absolute -top-3 right-4 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-bold text-white">Best pick</span>}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900">{o.name}</h3>
                  <p className="text-xs text-slate-500">{o.desc}</p>
                </div>
                <Badge tone={o.a.risk.tone}>{o.a.score}/100</Badge>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-xs text-slate-500">Loan amount</dt><dd className="font-semibold">{fmt(o.loan)}</dd></div>
                <div><dt className="text-xs text-slate-500">Tenure</dt><dd className="font-semibold">{o.tenure} months</dd></div>
                <div><dt className="text-xs text-slate-500">Monthly EMI</dt><dd className="font-semibold">{fmt(o.a.newEmi)}</dd></div>
                <div><dt className="text-xs text-slate-500">Total interest</dt><dd className="font-semibold">{fmt(o.a.totalInterest)}</dd></div>
                <div><dt className="text-xs text-slate-500">All EMIs / income</dt><dd className="font-semibold">{pct(o.a.foir)}</dd></div>
                <div><dt className="text-xs text-slate-500">Left each month</dt><dd className="font-semibold">{fmt(o.a.leftover)}</dd></div>
              </dl>

              <div className={`mt-4 rounded-lg px-3 py-2 text-xs font-semibold ${t.bg} ${t.text}`}>
                Simulated verdict: {o.verdict.label}
              </div>

              {o.id !== 'current' && (
                <p className="mt-2 text-xs text-slate-500">
                  vs your request: EMI {o.a.newEmi <= current.a.newEmi ? '▼' : '▲'} {fmt(Math.abs(o.a.newEmi - current.a.newEmi))},
                  interest {o.a.totalInterest <= current.a.totalInterest ? '▼' : '▲'} {fmt(Math.abs(o.a.totalInterest - current.a.totalInterest))}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="card mt-6">
        <h2 className="mb-4 font-bold text-slate-900">Score comparison</h2>
        <BarList
          items={options.map((o) => ({
            label: o.name, value: o.a.score, max: 100, color: o.a.risk.hex, text: `${o.a.score}/100 · EMI ${fmt(o.a.newEmi)}`,
          }))}
        />
        <p className="mt-4 text-xs text-slate-400">
          Trade-off: a longer tenure lowers the EMI but increases the total interest you pay. A smaller loan lowers both.
        </p>
      </div>

      <div className="mt-6">
        <button className="btn-primary" onClick={() => onGo('emi')}>Next: EMI Calculator →</button>
      </div>
    </div>
  )
}
