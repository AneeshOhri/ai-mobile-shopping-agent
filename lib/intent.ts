import { callGemini } from "./gemini"

// Hardcoded list of known phone models for reliable detection
const KNOWN_MODELS = ["Pixel 8a", "OnePlus 12R", "Galaxy A15"]

/**
 * Extract JSON safely from Gemini response
 */
function extractJSON(text: string) {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error("No JSON found in Gemini response")
  return JSON.parse(match[0])
}

/**
 * Extract user intent from shopping query
 * @param query User input string
 * @returns Intent object
 */
export async function extractIntent(query: string) {
  // --- Rule-based budget parsing ---
  const budgetMatch = query.match(/under\s*₹?\s*(\d+)/i)
  const budget = budgetMatch ? Number(budgetMatch[1]) : null

  // --- Gemini LLM prompt ---
  const prompt = `
Extract intent from this mobile shopping query.

Return ONLY valid JSON in this format:
{
  "intent": "recommendation" | "comparison" | "explanation" | "followup",
  "brand": string | null,
  "features": string[],
  "models": string[]
}

Query: "${query}"
`

  // --- Call Gemini safely ---
  let llm: any
  try {
    const raw = await callGemini(prompt)
    llm = extractJSON(raw)
  } catch {
    llm = { intent: null, brand: null, features: [], models: [] }
  }

  // --- Rule-based model detection for comparison ---
  const modelsFound = KNOWN_MODELS.filter(m =>
    query.toLowerCase().includes(m.toLowerCase())
  )

  // --- Determine intent ---
  const intentType =
    llm.intent ||
    (modelsFound.length >= 2
      ? "comparison"
      : query.toLowerCase().includes("explain")
      ? "explanation"
      : "recommendation")

  // --- Determine brand (optional, LLM fallback) ---
  const brand =
    llm.brand ||
    (["google", "oneplus", "samsung"].find(b =>
      query.toLowerCase().includes(b)
    ) || null)

  // --- Features (LLM or empty) ---
  const features = llm.features || []

  return {
    intent: intentType,
    brand,
    features,
    models: modelsFound,
    budget
  }
}
