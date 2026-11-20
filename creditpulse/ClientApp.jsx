'use client'

import dynamic from 'next/dynamic'

// The app reads saved data from localStorage on first render, so it only renders in the browser.
const CreditPulse = dynamic(() => import('./Root'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center text-sm text-slate-500" role="status">
      Loading CreditPulse…
    </div>
  ),
})

export default function ClientApp() {
  return <CreditPulse />
}
