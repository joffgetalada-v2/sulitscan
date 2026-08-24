"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react"

const MAX_MESSAGE_CHARS = 400
const MAX_USER_TURNS = 8

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Kumusta! I'm Sulit Assistant. Ask me in English or Taglish - like \"gift for mom under 500 pesos\" or \"may sulit ba na tumbler?\" - and I'll point you to real deals we've checked.",
}

const STARTERS = ["Gift ideas under ₱500", "May sulit ba na kitchen finds?", "Best skincare deals"]

/**
 * Renders assistant text, converting markdown links to internal <Link>s.
 * Only site-internal hrefs (starting with "/") are linkified; anything else
 * renders as plain text so a model mistake can never produce an external link.
 */
function MessageText({ content }: { content: string }) {
  const parts = content.split(/(\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (match && match[2].startsWith("/")) {
          return (
            <Link key={index} href={match[2]} className="font-semibold text-green-700 underline underline-offset-2 hover:text-green-800">
              {match[1]}
            </Link>
          )
        }
        return <span key={index}>{match ? `${match[1]}` : part}</span>
      })}
    </>
  )
}

export default function SulitAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isLimitReached, setIsLimitReached] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const userTurns = messages.filter((message) => message.role === "user").length
  const canChat = !isLimitReached && userTurns < MAX_USER_TURNS

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, isSending])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  async function send(text: string) {
    const message = text.trim().slice(0, MAX_MESSAGE_CHARS)
    if (!message || isSending || !canChat) return
    // History excludes the scripted welcome message.
    const history = messages.filter((entry) => entry !== WELCOME)
    setMessages((current) => [...current, { role: "user", content: message }])
    setInput("")
    setIsSending(true)
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      })
      const data: { reply?: string; limitReached?: boolean } = await response.json().catch(() => ({}))
      const reply =
        data.reply ??
        "Sorry, something went wrong on my end. Please try again, or browse [all deals](/deals) directly."
      if (data.limitReached) setIsLimitReached(true)
      setMessages((current) => [...current, { role: "assistant", content: reply }])
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "Sorry, hindi ako maka-connect ngayon. Please check your internet and try again." },
      ])
    } finally {
      setIsSending(false)
    }
  }

  function reset() {
    setMessages([WELCOME])
    setIsLimitReached(false)
    setInput("")
    inputRef.current?.focus()
  }

  return (
    <>
      {/* Raised above the deal pages' mobile sticky CTA bar (bottom-0, z-40). */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="sulit-assistant-panel"
        aria-label={isOpen ? "Close Sulit Assistant chat" : "Open Sulit Assistant chat"}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <MessageCircle className="w-6 h-6" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div
          id="sulit-assistant-panel"
          role="dialog"
          aria-label="Sulit Assistant chat"
          className="fixed inset-x-3 bottom-[9.5rem] md:inset-x-auto md:right-6 md:bottom-24 md:w-96 z-50 flex flex-col max-h-[70vh] md:max-h-[32rem] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight">Sulit Assistant</p>
              <p className="text-[11px] text-green-50 leading-tight">AI beta · finds deals from our catalog</p>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Start a new conversation"
              className="p-1.5 rounded-lg hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-slate-50" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "ml-8 rounded-2xl rounded-br-md bg-green-600 text-white text-sm px-3.5 py-2.5 whitespace-pre-line"
                    : "mr-8 rounded-2xl rounded-bl-md bg-white border border-slate-100 text-slate-700 text-sm px-3.5 py-2.5 shadow-sm whitespace-pre-line"
                }
              >
                <MessageText content={message.content} />
              </div>
            ))}
            {isSending && (
              <div className="mr-8 rounded-2xl rounded-bl-md bg-white border border-slate-100 px-3.5 py-2.5 shadow-sm w-fit" aria-label="Sulit Assistant is typing">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:120ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:240ms]" />
                </span>
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => send(starter)}
                    className="text-xs font-medium text-green-700 bg-white border border-green-200 rounded-full px-3 py-1.5 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              void send(input)
            }}
            className="border-t border-slate-100 bg-white px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={MAX_MESSAGE_CHARS}
                disabled={!canChat || isSending}
                placeholder={canChat ? "Ask about a deal..." : "Chat limit reached - start over"}
                aria-label="Message Sulit Assistant"
                className="flex-1 min-w-0 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!canChat || isSending || input.trim().length === 0}
                aria-label="Send message"
                className="p-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">
              AI answers can make mistakes. Deals are affiliate links - always confirm the live price on the partner store.
            </p>
          </form>
        </div>
      )}
    </>
  )
}
