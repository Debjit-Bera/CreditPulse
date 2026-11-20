import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { Disclaimer, PageHeader } from '../components/ui'
import Icon from '../components/Icon'

// Config for the six required inputs
const FIELDS = [
  { name: 'age', label: 'Age', unit: 'years', placeholder: 'e.g. 28', hint: 'Used only to check age at loan maturity – it never lowers your score.' },
  { name: 'income', label: 'Monthly Income', unit: '₹', placeholder: 'e.g. 40000', hint: 'Your take-home income per month.' },
  { name: 'expenses', label: 'Monthly Expenses', unit: '₹', placeholder: 'e.g. 24000', hint: 'Rent, food, bills, travel etc. (do not include EMIs).' },
  { name: 'emi', label: 'Existing Monthly EMI', unit: '₹', placeholder: 'e.g. 8000', hint: 'Total of all current loan EMIs. Enter 0 if none.' },
  { name: 'loan', label: 'Loan Amount Required', unit: '₹', placeholder: 'e.g. 200000', hint: 'Between ₹1,000 and ₹10,00,000.' },
  { name: 'tenure', label: 'Loan Duration', unit: 'months', placeholder: 'e.g. 24', hint: 'Between 3 and 120 months.' },
]

export default function DetailsPage({ onDone }) {
  const { form, updateField, saveProfile, loadDemo, reset, profile } = useFinance()
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = saveProfile()
    setErrors(errs)
    if (Object.keys(errs).length === 0) onDone()
  }

  const handleDemo = (kind) => {
    loadDemo(kind)
    setErrors({})
  }

  const handleReset = () => {
    reset()
    setErrors({})
  }

  return (
    <div>
      <PageHeader
        title="Your Financial Details"
        subtitle="Enter these six numbers once. Every feature in CreditPulse will reuse them."
      />
      <Disclaimer />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card lg:col-span-2" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="mb-1.5 block text-sm font-semibold text-slate-700">
                  {f.label}
                </label>
                <div className="relative">
                  <input
                    id={f.name}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    className={`input pr-16 ${errors[f.name] ? '!border-red-400 !ring-red-100' : ''}`}
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={(e) => updateField(f.name, e.target.value)}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                    {f.unit}
                  </span>
                </div>
                {errors[f.name] ? (
                  <p className="mt-1 text-xs font-medium text-red-600">{errors[f.name]}</p>
                ) : (
                  <p className="mt-1 text-xs text-slate-400">{f.hint}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">
              <Icon name="check" size={18} /> Save &amp; Analyze
            </button>
            <button type="button" className="btn-ghost" onClick={handleReset}>
              <Icon name="reset" size={16} /> Reset
            </button>
          </div>
          {profile && (
            <p className="mt-3 text-xs text-emerald-600">✓ Details saved – you can open any feature from the sidebar.</p>
          )}
        </form>

        <div className="card h-fit">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Icon name="zap" size={20} />
          </div>
          <h2 className="font-bold text-slate-900">Try demo data</h2>
          <p className="mt-1 text-sm text-slate-500">Great for a quick hackathon demo. One click fills the form and saves it.</p>
          <div className="mt-4 space-y-2">
            <button type="button" className="btn-ghost w-full" onClick={() => handleDemo('needsWork')}>
              Demo: Needs improvement
            </button>
            <button type="button" className="btn-ghost w-full" onClick={() => handleDemo('strong')}>
              Demo: Strong profile
            </button>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Your data stays in your browser (localStorage). Nothing is sent to any server.
          </p>
        </div>
      </div>
    </div>
  )
}
