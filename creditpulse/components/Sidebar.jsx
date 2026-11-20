import Icon from './Icon'

export const PAGES = [
  { id: 'details', label: 'Your Details', icon: 'user' },
  { id: 'score', label: 'Smart Credit Score', icon: 'activity', step: 1 },
  { id: 'rejection', label: 'Why Was My Loan Rejected?', icon: 'alert', step: 2 },
  { id: 'improve', label: 'Score Improvement', icon: 'trend', step: 3 },
  { id: 'chat', label: 'CreditPulse AI Assistant', icon: 'chat', step: 4 },
  { id: 'alternatives', label: 'Alternative Loans', icon: 'repeat', step: 5 },
  { id: 'emi', label: 'EMI Calculator', icon: 'percent', step: 6 },
]

export default function Sidebar({ page, onNavigate, open, onClose }) {
  return (
    <>
      {/* dark overlay on mobile when the menu is open */}
      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-900 text-slate-300 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
              <Icon name="activity" size={22} />
            </div>
            <div>
              <p className="text-lg font-extrabold leading-tight text-white">CreditPulse</p>
              <p className="text-xs text-slate-400">Micro-Loan Risk Simulator</p>
            </div>
          </div>
          <button className="text-slate-400 lg:hidden" onClick={onClose} aria-label="Close menu">
            <Icon name="x" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {PAGES.map((p) => {
            const active = page === p.id
            return (
              <button
                key={p.id}
                onClick={() => onNavigate(p.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  active ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon name={p.icon} size={18} />
                <span className="flex-1">{p.label}</span>
                {p.step && (
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${active ? 'bg-white/20' : 'bg-slate-800'}`}>
                    {p.step}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="m-4 rounded-xl bg-slate-800 p-4 text-xs leading-relaxed text-slate-400">
          <div className="mb-1 flex items-center gap-2 font-semibold text-slate-200">
            <Icon name="shield" size={14} /> Simulation only
          </div>
          Scores are simulated and are not actual bank decisions.
        </div>
      </aside>
    </>
  )
}
