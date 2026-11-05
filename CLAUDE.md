# Name Shuffle

## Idea

A shuffle machine that generates a name for our theater group. The group is searching for a name and has many words and fragments from brainstorming sessions. The machine jumbles these fragments into one name.

- **Input:** the `/admin` page, with a form to add new entries (words/fragments) to either list the shuffle algorithm draws from.
- **Output:** two parts:
  - a **prefix**, e.g. "Ensemble", "Theater"
  - a **main name**, e.g. "Theatrale"
- **Look and feel:** a slot machine. Reels spin and settle on the result, with animations.

## Stack

- Vue 3 + Vite, TypeScript
- Vue Router, Pinia
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- pnpm as package manager

## Commands

- `pnpm dev` start dev server
- `pnpm build` type-check and build
- `pnpm run type-check` run vue-tsc

**Always check types with `pnpm run type-check` and nothing else** (no direct `vue-tsc` or other type-check commands).

## Structure

- `src/App.vue` page layout: slim header (nav links, theme buttons) above the current view.
- `src/views/Home.vue` root route: two reels, connector buttons, posters below.
- `src/views/Favorites.vue` `/favorites` route: the saved names, with a button to remove each.
- `src/stores/favorites.ts` favorite names, saved in localStorage. The heart button on the home page toggles the current name.
- `src/composables/useShuffledName.ts` reel state, chaos mode, connectors, and the name the posters show.
- `src/views/Admin.vue` `/admin` route: add words to either list.
- `src/components/SlotReel.vue` one pill-shaped reel with its shuffle (die icon) button inside on the left and an on/off switch on the outline. Spin animation: fast, gradually slowing, slight bounce. Never lands on the word already shown. Respects reduced motion. Tuning constants are at the top of the file.
- `src/components/TheaterPoster.vue` illustrated poster for "Die Gerechten" by Albert Camus (figure and bomb), group name prominent at the bottom right, play title small.
- `src/components/TheaterPosterGeometric.vue` second poster: geometric tiles, the group name is the star, play only as a small line.
- `src/components/ConnectorButton.vue` round accent toggle ball with a word in it ("und", "aber"). One connector at a time goes between the two words on the posters.
- `src/components/CrossButton.vue` round × / + button, sized with a size class.
- `src/components/PosterCard.vue` a poster with its empty box, pop-in, shake and flip to the Instagram post.
- `src/components/PosterName.vue` the group name as SVG text, shared by both posters.
- `src/components/FlipCard.vue` click-to-flip 3D card with a front and a back slot. Each poster flips to reveal itself as a post.
- `src/components/InstagramPostMock.vue` mocked-up Instagram feed post; the post image comes in through its slot.
- `src/components/DebugPanel.vue` theme switcher buttons in the header.
- `src/stores/words.ts` the word lists (prefixes and main words): dummy defaults plus added words, saved in localStorage.
- `src/utils/posterWord.ts` text sizing for the posters, including splitting a single word in two lines.
- `src/stores/theme.ts` selected theme, saved in localStorage and set as `data-theme` on `<html>`.
- `src/assets/main.css` fonts, theme colors, `dotted-shadow` utility.

## Behaviour

- Posters appear once every enabled reel has a word.
- Either reel can be switched off, but never both. The posters then show only the remaining word, in the main spot.
- Chaos mode generates neologisms. The first reel shuffles the opening of each entry (Theater: Thea), the second reel any chunk (Resonanz: Reso, Nanz), both from `src/utils/wordParts.ts`, a rule-of-thumb syllable splitter that merges syllables up to at least 4 letters. `src/utils/neologism.ts` joins the two, smoothing shared letters and double vowels at the join (Konfron + Nanz: Konfronanz), and scores names by length, ending and consonant clusters. Once one reel has landed, the other only offers its 10 best-sounding partners.
- Responsive: reels stack in one column on mobile, side by side from `md`.

## Design

- **Fonts** (Google Fonts import in `main.css`): Google Sans Flex (`font-sans`, body), Russo One (`font-heading`), Nunito bold (`font-slot`, the reel words).
- **Themes:** eggshell (default, set in `stores/theme.ts` and on `<html>` in `index.html`), pastel, twilight (dark), curtain. Each theme sets the same role variables (`primary`, `on-primary`, `accent` for the prefix word, `highlight` for the main word, `muted`, `surface`, `on-surface`) from its palette colors. The two accents are never the text color, so they stand out; both are also used on the posters. In Curtain, `highlight` and `primary` are both oxblood, because the palette has no other strong color. Components only use the role names as Tailwind colors, never raw hex. To add a theme: a block in `main.css` and an entry in `stores/theme.ts`.
- **Dotted shadow:** halftone dot pattern behind the reel pills (`dotted-shadow` utility). It reserves its own space with padding so it never overflows its container.
- Posters use theme colors through the same role classes (`fill-surface`, `fill-accent`, ...).

## Notes

- Words are saved per browser (localStorage), so they aren't shared between devices or people.
- Prefixes and main-name fragments are two separate pools (one reel each).
- The package.json `devEngines` pin Node 26.13.0 and a pnpm version; the shell may not match them.
