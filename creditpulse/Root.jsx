'use client'

import App from './App'
import { FinanceProvider } from './context/FinanceContext'

export default function Root() {
  return (
    <FinanceProvider>
      <App />
    </FinanceProvider>
  )
}
