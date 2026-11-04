<script setup lang="ts">
import { computed, useId } from 'vue'

const props = defineProps<{
  prefix: string
  mainWord: string
}>()

const ringId = useId()

const UMLAUTS: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }

// "Überwiegend Vibelig" -> "ueberwiegend.vibelig"
const username = computed(() =>
  `${props.prefix} ${props.mainWord}`
    .trim()
    .toLowerCase()
    .replace(/[äöüß]/g, (letter) => UMLAUTS[letter] ?? letter)
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9._]/g, ''),
)

// Icons on a 24 x 24 grid
const ICONS = {
  heart: 'M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z',
  comment: 'M12 3a9 9 0 1 0 4.5 16.8L21 21l-1.2-4.5A9 9 0 0 0 12 3z',
  send: 'M21 3 3 10l7 3.5L13.5 21zM21 3 10 13.5',
  bookmark: 'M6 3h12v18l-6-4.5L6 21z',
  home: 'M3 11l9-8 9 8v10h-6v-6H9v6H3z',
  search: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM21 21l-4.5-4.5',
  add: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM12 8v8M8 12h8',
  video: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM10 8.5v7l5.5-3.5z',
  profile: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6.5 18.5c1-2.5 3-3.5 5.5-3.5s4.5 1 5.5 3.5',
}

const TOP_ICONS = [
  { d: ICONS.heart, x: 328, y: 34 },
  { d: ICONS.comment, x: 364, y: 34 },
]
const ACTION_ICONS = [
  { d: ICONS.heart, x: 16, y: 626 },
  { d: ICONS.comment, x: 56, y: 626 },
  { d: ICONS.send, x: 96, y: 626 },
  { d: ICONS.bookmark, x: 360, y: 626 },
]
const NAV_ICONS = [
  { d: ICONS.home, x: 36, y: 728 },
  { d: ICONS.search, x: 112, y: 728 },
  { d: ICONS.add, x: 188, y: 728 },
  { d: ICONS.video, x: 264, y: 728 },
  { d: ICONS.profile, x: 340, y: 728 },
]
const ALL_ICONS = [...TOP_ICONS, ...ACTION_ICONS, ...NAV_ICONS]
</script>

<template>
  <svg
    viewBox="0 0 400 760"
    role="img"
    :aria-label="`Mockup eines Instagram-Posts von ${username} mit dem Plakat zu Die Gerechten`"
  >
    <defs>
      <linearGradient :id="ringId" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="#f9ce34" />
        <stop offset="0.5" stop-color="#ee2a7b" />
        <stop offset="1" stop-color="#6228d7" />
      </linearGradient>
    </defs>

    <rect width="400" height="760" rx="20" class="fill-white" />

    <!-- Status bar -->
    <text x="24" y="21" font-size="13" font-weight="700" class="fill-black font-sans">9:41</text>
    <rect x="350" y="10" width="26" height="12" rx="3" fill="none" stroke-width="1.5" class="stroke-black" />
    <rect x="352" y="12" width="18" height="8" rx="1.5" class="fill-black" />

    <!-- App bar -->
    <text x="16" y="57" font-size="28" font-style="italic" font-family="Snell Roundhand, Brush Script MT, cursive" class="fill-black">
      Instagram
    </text>

    <!-- Post header -->
    <circle cx="34" cy="92" r="19" fill="none" :stroke="`url(#${ringId})`" stroke-width="3" />
    <circle cx="34" cy="92" r="15" class="fill-accent" />
    <text x="62" y="89" font-size="14" font-weight="700" class="fill-black font-sans">{{ username }}</text>
    <text x="62" y="105" font-size="12" class="fill-black font-sans">Die Gerechten</text>
    <g class="fill-black">
      <circle cx="362" cy="92" r="1.8" />
      <circle cx="370" cy="92" r="1.8" />
      <circle cx="378" cy="92" r="1.8" />
    </g>

    <!-- Post image: 4:5 with the poster inside -->
    <rect y="116" width="400" height="500" class="fill-surface" />
    <slot x="37.5" y="136" width="325" height="460" />

    <!-- Likes and caption -->
    <text x="16" y="673" font-size="14" font-weight="700" class="fill-black font-sans">Gefällt 1.204 Mal</text>
    <text x="16" y="692" font-size="13" font-weight="700" class="fill-black font-sans">{{ username }}</text>
    <text x="16" y="708" font-size="13" class="fill-black font-sans">Die Gerechten von Albert Camus. Bald auf der Bühne!</text>

    <!-- Tab bar -->
    <line x1="0" y1="719" x2="400" y2="719" stroke-width="1" class="stroke-gray-300" />

    <!-- All icons -->
    <g fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-black">
      <path
        v-for="icon in ALL_ICONS"
        :key="`${icon.x}-${icon.y}`"
        :d="icon.d"
        :transform="`translate(${icon.x} ${icon.y})`"
      />
    </g>

    <!-- Border -->
    <rect x="2" y="2" width="396" height="756" rx="18" fill="none" stroke-width="4" class="stroke-on-surface" />
  </svg>
</template>
