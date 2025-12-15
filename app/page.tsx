"use client"

import { useState } from "react"
import ProductCard from "../components/ProductCard"
import ComparisonTable from "../components/ComparisonTable"


type Message = {
  q: string
  a: {
    reply: string
    products?: any[]
    comparison?: any[]
  }
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim() || loading) return

    setLoading(true)

    const userQuery = input
    setInput("")

    // optimistic UI update
    setMessages(prev => [...prev, { q: userQuery, a: { reply: "Thinking..." } }])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userQuery })
      })

      if (!res.ok) {
        throw new Error("Server error")
      }

      const data = await res.json()

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { q: userQuery, a: data }
        return updated
      })
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          q: userQuery,
          a: { reply: "Something went wrong. Please try again." }
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2>📱 AI Mobile Shopping Assistant</h2>

      <div style={{ marginBottom: 20 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <p><b>You:</b> {m.q}</p>
            <p><b>Agent:</b> {m.a.reply}</p>

            {/* Product recommendations */}
            {m.a.products?.length > 0 && (
              <div>
                {m.a.products.map(p => (
                  <ProductCard key={p.id} phone={p} />
                ))}
              </div>
            )}

            {/* Comparison table */}
            {m.a.comparison?.length > 0 && (
              <ComparisonTable phones={m.a.comparison} />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about mobiles..."
          style={{ flex: 1, padding: 10 }}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>

      <p style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
        Try: "Best camera phone under 30000", "Compare Pixel 8a vs OnePlus 12R",
        "Explain OIS vs EIS"
      </p>
    </div>
  )
}
