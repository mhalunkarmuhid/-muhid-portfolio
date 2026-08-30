# What changed in `index.html`

1. **Profile photo** — your uploaded photo is embedded directly in the file
   as a base64 data URI (no separate image file to lose track of). It sits
   above the "Mumbai, India" line in the Hero section, in a circular frame
   with a gradient border that matches the site's accent colors. The face is
   brought into frame with a CSS `transform: scale()` + `transform-origin`
   zoom (search `.hero-avatar` in the `<style>` block) — the original photo
   file itself is untouched and unaltered, only the on-screen crop is
   adjusted.
2. **Muhid AI chatbot** — a floating button (bottom-right) that opens a chat
   panel styled with the site's existing colors, fonts, and border radius.
   It works immediately with zero setup, using a local knowledge-base
   responder built from the same `PROJECTS` / `SKILLS` / `CONFIG` data
   already in the page.

# Wiring up a real AI backend (optional)

The chatbot already calls `POST /api/chat` first, and only falls back to the
knowledge-base responder if that call fails or isn't deployed. To make it
genuinely AI-powered:

1. Deploy `api/chat.js` alongside `index.html` (this file is written as a
   Vercel serverless function — see the commented Express alternative at
   the bottom of that file if you're hosting elsewhere).
2. Copy `.env.example` to `.env` and add your real API key. **Never** paste
   an API key into `index.html` or any other frontend file — it would be
   visible to anyone who views page source.
3. Redeploy. The chatbot will detect the working endpoint automatically and
   the footer label switches from "KNOWLEDGE-BASE MODE" to "AI MODE".

If you skip all of this, the chatbot still works — it just answers from the
knowledge base instead of a live model.

# Files changed / added

- `index.html` — modified (photo + chatbot added; nothing else removed)
- `api/chat.js` — new (documented backend endpoint)
- `.env.example` — new (env var template)
- `README-chatbot.md` — new (this file)
