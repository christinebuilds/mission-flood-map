# AGENTS.md

The rules for AI coding agents on this project live in [CLAUDE.md](CLAUDE.md). Read it before making any change.

In short: no build step; test at iPhone 13 size with real taps; never post real rows to Supabase while testing (mock with `page.route`); keep the "Not an official service · Emergency: 9-1-1" wording; keep element IDs stable; run `node tools/validate.mjs`; one feature per pull request with before/after phone screenshots.
