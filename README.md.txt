AI Mobile Shopping Chat Agent

## Overview
An AI-powered conversational shopping assistant that helps users discover, compare, and understand mobile phones.  
The agent supports natural language queries, structured recommendations, model comparisons, and factual explanations while remaining safe, deterministic, and grounded in a real dataset.


## Features
- Conversational mobile discovery (budget, brand, features)
- Explainable recommendations (why a phone is suggested)
- Side-by-side phone comparison
- Knowledge queries (e.g., OIS vs EIS)
- Safety & adversarial prompt handling
- Deterministic fallbacks (no hallucinations)
- Clean web-based chat UI


## Tech Stack
Frontend
- Next.js 14 (React)
- Client-side chat UI with product cards & comparison table

Backend
- Next.js API Routes
- Google Gemini 1.5 Flash (LLM)
- Rule-based + LLM hybrid intent parsing

Data Layer
- Structured JSON phone catalog  
- Architecture allows easy swap to SQLite or Supabase

Deployment
- Vercel (Serverless)

---

## Architecture Overview

User Query  
→ Safety Layer (prompt injection & abuse checks)  
→ Intent Extraction (LLM + rule-based parsing)  
→ Mode Routing  
  • Recommendation  
  • Comparison  
  • Explanation  
→ Dataset-grounded retrieval  
→ Structured response (UI rendering)

This separation prevents hallucinations and ensures predictable behavior.

---

## Prompt Design & Safety Strategy

### Prompt Design
- Gemini is used **only for intent extraction**, not for generating specs
- Strict JSON output enforced
- All recommendations are grounded in the local dataset

### Safety Handling
The agent explicitly refuses:
- Requests for API keys or system prompts
- Prompt injection attempts
- Brand defamation or abusive language

Fallback logic ensures:
- App never crashes if LLM output is malformed
- Core functionality works even without LLM availability


## Setup Instructions

1. Clone Repository

git clone https://github.com/<your-username>/ai-mobile-shopping-agent
cd ai-mobile-shopping-agent

2. Install Dependencies
npm install

3. Environment Variables
Create .env.local:
GEMINI_API_KEY=your_api_key_here

4. Run Locally
npm run dev
Open: http://localhost:3000

Example Queries

Best camera phone under ₹30,000
Compare Pixel 8a vs OnePlus 12R
Show me Samsung phones only, under ₹25k
Explain OIS vs EIS


Known Limitations

Static dataset (no live pricing)
Limited phone catalog (demo scope)
No user authentication
No checkout / payment integration

Future Improvements

Supabase / PostgreSQL integration
Streaming responses (SSE)
Larger phone catalog via external APIs
User preference memory
Advanced ranking models