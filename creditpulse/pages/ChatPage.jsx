import { useEffect, useRef, useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { Disclaimer, EmptyState, PageHeader } from '../components/ui'
import Icon from '../components/Icon'
import { SUGGESTIONS, getReply } from '../utils/assistant'

export default function ChatPage({ onGo }) {
  const { profile, rate, chat, setChat } = useFinance()
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  // always scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [chat])

  if (!profile) return <EmptyState onGo={onGo} />

  const send = (question) => {
    const q = question.trim()
    if (!q) return
    const reply = getReply(q, profile, rate)
    setChat((c) => [...c, { from: 'user', text: q }, { from: 'bot', text: reply }])
    setText('')
  }

  return (
    <div>
      <PageHeader step={4} title="CreditPulse AI Assistant" subtitle="Ask questions – answers use the numbers you already entered." />
      <Disclaimer />

      <div className="card flex h-[32rem] flex-col !p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {chat.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === 'user' ? 'rounded-br-sm bg-indigo-600 text-white' : 'rounded-bl-sm bg-slate-100 text-slate-800'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100">
                {s}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              send(text)
            }}
          >
            <input className="input" placeholder="Type your question…" value={text} onChange={(e) => setText(e.target.value)} />
            <button type="submit" className="btn-primary" aria-label="Send">
              <Icon name="send" size={18} />
            </button>
          </form>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">This assistant is rule-based (no external AI API), so it works offline.</p>
      <div className="mt-4">
        <button className="btn-primary" onClick={() => onGo('alternatives')}>Next: Alternative loans →</button>
      </div>
    </div>
  )
}
