import { NextResponse } from "next/server"
import { enforceSafety } from "../../../lib/safety"
import { extractIntent } from "../../../lib/intent"
import { recommend, compare } from "../../../lib/recommender"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message: string = body?.message?.trim()

    if (!message) {
      return NextResponse.json({ reply: "Please enter a message." })
    }

    // 🛡️ SAFETY LAYER
    const safety = enforceSafety(message)
    if (safety) {
      return NextResponse.json({ reply: safety })
    }

    // 🧠 INTENT EXTRACTION (LLM + RULE-BASED)
    let intent
    try {
      intent = await extractIntent(message)
    } catch (err) {
      // HARD FALLBACK IF GEMINI FAILS
      intent = {
        intent: message.toLowerCase().includes("compare")
          ? "comparison"
          : message.toLowerCase().includes("explain")
          ? "explanation"
          : "recommendation",
        budget: null,
        brand: null,
        features: [],
        models: []
      }
    }

    // 📘 EXPLANATION MODE (NO LLM — SAFE)
    if (intent.intent === "explanation") {
      return NextResponse.json({
        reply:
          "OIS (Optical Image Stabilization) uses physical hardware to stabilize the camera lens, " +
          "which significantly improves low-light photography and reduces blur. " +
          "EIS (Electronic Image Stabilization) is software-based and stabilizes video by cropping frames, " +
          "making it less effective for photos, especially in low light."
      })
    }

    // 🔥 COMPARISON MODE
    if (intent.intent === "comparison") {
      const products = compare(intent.models)

      if (products.length >= 2) {
        return NextResponse.json({
          reply: "Here’s a side-by-side comparison:",
          comparison: products
        })
      }

      return NextResponse.json({
        reply:
          "Please specify at least two phone models to compare (e.g., Compare Pixel 8a vs OnePlus 12R)."
      })
    }

    // 📦 RECOMMENDATION MODE
    const products = recommend(intent)

    if (!products.length) {
      return NextResponse.json({
        reply: "No matching phones found for your criteria."
      })
    }

    return NextResponse.json({
      reply: "Here are some good options:",
      products
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({
      reply: "Internal server error. Please try again later."
    })
  }
}
