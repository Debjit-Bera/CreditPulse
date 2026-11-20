import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_RATE, analyze, toProfile, validate } from '../utils/finance'

// One shared store: the user enters their data ONCE and every page reuses it.
const FinanceContext = createContext(null)
const STORAGE_KEY = 'creditpulse_v1'

const EMPTY_FORM = { age: '', income: '', expenses: '', emi: '', loan: '', tenure: '' }

export const DEMOS = {
  needsWork: { age: '28', income: '40000', expenses: '24000', emi: '8000', loan: '200000', tenure: '24' },
  strong: { age: '30', income: '85000', expenses: '30000', emi: '5000', loan: '150000', tenure: '24' },
}

const WELCOME = {
  from: 'bot',
  text: 'Hi! I am the CreditPulse AI Assistant 🤖. Ask me about your score, loan rejection reasons, EMI or safer options. Remember: everything here is simulated.',
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function FinanceProvider({ children }) {
  const saved = useMemo(loadSaved, [])
  const [form, setForm] = useState(saved?.form || EMPTY_FORM)
  const [profile, setProfile] = useState(saved?.profile || null)
  const [rate, setRate] = useState(saved?.rate ?? DEFAULT_RATE)
  const [chat, setChat] = useState([WELCOME])

  // keep data in the browser so a page refresh does not lose it
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, profile, rate }))
    } catch {
      /* ignore storage errors */
    }
  }, [form, profile, rate])

  const analysis = useMemo(() => (profile ? analyze(profile, rate) : null), [profile, rate])

  const updateField = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  // returns the errors object (empty = success)
  const saveProfile = () => {
    const errors = validate(form)
    if (Object.keys(errors).length === 0) setProfile(toProfile(form))
    return errors
  }

  const loadDemo = (kind) => {
    setForm(DEMOS[kind])
    setProfile(toProfile(DEMOS[kind]))
    setRate(DEFAULT_RATE)
    setChat([WELCOME])
  }

  const reset = () => {
    setForm(EMPTY_FORM)
    setProfile(null)
    setRate(DEFAULT_RATE)
    setChat([WELCOME])
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  const value = { form, updateField, profile, analysis, rate, setRate, chat, setChat, saveProfile, loadDemo, reset }
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used inside FinanceProvider')
  return ctx
}
