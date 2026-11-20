'use client'

import { useState } from 'react'
import Sidebar, { PAGES } from './components/Sidebar'
import Icon from './components/Icon'
import { useFinance } from './context/FinanceContext'
import DetailsPage from './pages/DetailsPage'
import ScorePage from './pages/ScorePage'
import RejectionPage from './pages/RejectionPage'
import ImprovePage from './pages/ImprovePage'
import ChatPage from './pages/ChatPage'
import AlternativesPage from './pages/AlternativesPage'
import EmiPage from './pages/EmiPage'

export default function App() {
  const [page, setPage] = useState('details')
  const [menuOpen, setMenuOpen] = useState(false)
  const { reset, profile } = useFinance()

  const go = (id) => {
    setPage(id)
    setMenuOpen(false)
    window.scrollTo({ top: 0 })
  }

  const current = PAGES.find((p) => p.id === page)

  const pages = {
    details: <DetailsPage onDone={() => go('score')} />,
    score: <ScorePage onGo={go} />,
    rejection: <RejectionPage onGo={go} />,
    improve: <ImprovePage onGo={go} />,
    chat: <ChatPage onGo={go} />,
    alternatives: <AlternativesPage onGo={go} />,
    emi: <EmiPage />,
  }

  return (
    <div className="min-h-screen">
      <Sidebar page={page} onNavigate={go} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="lg:pl-72">
        {/* top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Icon name="menu" />
            </button>
            <p className="font-semibold text-slate-800">{current?.label}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 sm:inline">
              Simulated results
            </span>
            <button
              className="btn-ghost !px-3 !py-2"
              onClick={() => {
                if (window.confirm('Clear all your entered data and start over?')) {
                  reset()
                  setPage('details')
                }
              }}
              title="Reset all data"
            >
              <Icon name="reset" size={16} /> <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
          {pages[page]}
          <footer className="mt-12 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
            CreditPulse is a hackathon learning project. Scores and predictions are simulated and are not actual bank decisions.
            {profile ? '' : ' Start by entering your details.'}
          </footer>
        </main>
      </div>
    </div>
  )
}
