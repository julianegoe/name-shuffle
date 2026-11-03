# Name Shuffle

## Idea

A shuffle machine that generates a name for our theater group. The group is searching for a name and has many words and fragments from brainstorming sessions. The machine jumbles these fragments into one name.

- **Input:** a form to add new entries (words/fragments) to the pool the shuffle algorithm draws from.
- **Output:** two parts:
  - a **prefix**, e.g. "Ensemble", "Theater"
  - a **main name**, e.g. "Theatrale"
- **Look and feel:** a slot machine. Reels spin and settle on the result, with animations.

## Stack

- Vue 3 + Vite, TypeScript
- Vue Router, Pinia (state, e.g. the fragment pool)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- pnpm as package manager

## Commands

- `pnpm dev` start dev server
- `pnpm build` type-check and build
- `pnpm type-check` run vue-tsc

## Notes

- Keep the fragment pool in a Pinia store; consider persisting it (localStorage) so brainstormed entries survive reloads.
- Prefixes and main-name fragments are likely two separate pools (one reel each).
