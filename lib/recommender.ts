import phones from "../data/phones.json"

/**
 * Recommend phones based on user intent
 * @param intent { budget, brand, features, models }
 * @returns Array of recommended phones (max 3)
 */
export function recommend(intent: any) {
  let results = phones

  // Filter by budget (rule-based, robust)
  if (intent.budget !== null && !isNaN(intent.budget)) {
    results = results.filter(p => p.price <= intent.budget)
  }

  // Filter by brand (case-insensitive)
  if (intent.brand) {
    results = results.filter(
      p => p.brand.toLowerCase() === intent.brand.toLowerCase()
    )
  }

  // Feature-based filtering
  if (intent.features && intent.features.length > 0) {
    if (intent.features.includes("camera")) {
      results = results.filter(p => p.camera.includes("OIS"))
    }
    // Add more features here if needed (battery, display, etc.)
  }

  // Return top 3 matches
  return results.slice(0, 3)
}

/**
 * Compare specific phone models by exact/partial name match
 * @param models Array of model names
 * @returns Array of phones matching the models
 */
export function compare(models: string[]) {
  if (!models || models.length === 0) return []

  return phones.filter(p =>
    models.some(m =>
      `${p.brand} ${p.model}`.toLowerCase().includes(m.toLowerCase())
    )
  )
}
