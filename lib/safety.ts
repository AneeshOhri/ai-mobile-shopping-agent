export function enforceSafety(text: string): string | null {
const blocked = ["api key", "system prompt", "ignore rules", "trash"]
if (blocked.some(b => text.toLowerCase().includes(b))) {
return "I can’t help with that request."
}
return null
}