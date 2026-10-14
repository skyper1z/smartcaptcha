# Website repository guidance

Parent instructions: `../../CLAUDE.md`.

- Current branch: `feat/whatsapp-ai-catalog-integration`.
- This is a static vanilla HTML/CSS/JavaScript site deployed separately on Vercel.
- Do not deploy, push, or edit `main`.
- Preserve the embedded catalog fallback until canonical Supabase compatibility reads are tested.
- Do not add backend secrets or trusted business operations to browser code.
- Escape dynamic text and sanitize intentionally rich content.
- The approved `Funeral Coverage 2026` fallback price is GHS 6,500.
- Before modifying price display or catalog loading, compare `packages-data.js`, `script.js`, `index.html` terms, and the canonical catalog migration.
- Validate JavaScript syntax and manually inspect relevant pages after changes.
