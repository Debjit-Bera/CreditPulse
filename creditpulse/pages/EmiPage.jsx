import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { Disclaimer, PageHeader, Stat } from '../components/ui'
import { DonutChart } from '../components/Charts'
import { calcEmi, fmt, schedule } from '../utils/finance'

export default function EmiPage() {
  const { profile, rate, setRate } = useFinance()

  // The calculator starts with the loan from "Your Details" but lets you try what-ifs.
  const [amount, setAmount] = useState(profile ? String(profile.loan) : '100000')
  const [months, setMonths] = useState(profile ? String(profile.tenure) : '12')

  const P = Number(amount)
  const N = Number(months)
  const valid = P >= 1000 && P <= 100000000 && Number.isInteger(N) && N >= 1 && N <= 360
  const emi = valid ? calcEmi(P, rate, N) : 0
  const total = emi * N
  const interest = total - P
  const rows = valid ? schedule(P, rate, N, 6) : []

  const setRateSafe = (v) => {
    const n = Number(v)
    if (v === '') return setRate(0)
    if (!isNaN(n)) setRate(Math.min(40, Math.max(0, n)))
  }

  return (
    <div>
      <PageHeader step={6} title="EMI Calculator" subtitle="Monthly EMI, total interest and total repayment. The interest rate is adjustable (default 12%)." />
      <Disclaimer />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card lg:col-span-2">
          <h2 className="mb-4 font-bold text-slate-900">Loan inputs</h2>

          <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="amt">Loan amount (₹)</label>
          <input id="amt" type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />

          <label className="mb-1.5 mt-4 block text-sm font-semibold text-slate-700" htmlFor="mon">Duration (months)</label>
          <input id="mon" type="number" className="input" value={months} onChange={(e) => setMonths(e.target.value)} />

          <div className="mb-1.5 mt-4 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700" htmlFor="rate">Interest rate (% per year)</label>
            <input
              type="number" step="0.5" min="0" max="40"
              className="input !w-20 !py-1 text-center"
              value={rate}
              onChange={(e) => setRateSafe(e.target.value)}
              aria-label="Interest rate number"
            />
          </div>
          <input id="rate" type="range" min="1" max="36" step="0.5" value={rate} onChange={(e) => setRateSafe(e.target.value)} className="w-full accent-indigo-600" />
          <div className="flex justify-between text-xs text-slate-400"><span>1%</span><span>36%</span></div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button className="btn-ghost !py-2 text-xs" onClick={() => setRate(12)}>Reset rate to 12%</button>
            {profile && (
              <button className="btn-ghost !py-2 text-xs" onClick={() => { setAmount(String(profile.loan)); setMonths(String(profile.tenure)) }}>
                Use my loan details
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-400">The interest rate you set here is also used for your score and loan comparisons.</p>
          {!valid && <p className="mt-3 text-sm font-medium text-red-600">Enter an amount of at least ₹1,000 and a duration of 1–360 whole months.</p>}
        </div>

        <div className="card lg:col-span-3">
          <h2 className="mb-4 font-bold text-slate-900">Results</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Monthly EMI" value={fmt(emi)} />
            <Stat label="Total interest" value={fmt(interest)} />
            <Stat label="Total repayment" value={fmt(total)} />
          </div>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
            <DonutChart
              parts={[
                { label: 'Principal', value: valid ? P : 0, color: '#4f46e5' },
                { label: 'Interest', value: valid ? Math.max(0, interest) : 0, color: '#f59e0b' },
              ]}
            />
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-indigo-600" /> Principal: <strong>{fmt(valid ? P : 0)}</strong></p>
              <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500" /> Interest: <strong>{fmt(valid ? interest : 0)}</strong></p>
              {valid && total > 0 && (
                <p className="text-xs text-slate-500">Interest is {((interest / total) * 100).toFixed(0)}% of everything you repay.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="card mt-6 overflow-x-auto">
          <h2 className="mb-3 font-bold text-slate-900">First {rows.length} months of repayment</h2>
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="py-2">Month</th><th>Principal paid</th><th>Interest paid</th><th>Balance left</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.month} className="border-b border-slate-100">
                  <td className="py-2 font-medium">{r.month}</td>
                  <td>{fmt(r.principalPart)}</td>
                  <td>{fmt(r.interest)}</td>
                  <td>{fmt(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
