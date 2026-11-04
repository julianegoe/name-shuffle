<script setup lang="ts">
import { computed } from "vue";
import { fitMainWord, fitPrefix, soloWordLayout } from "@/utils/posterWord";

const props = defineProps<{
  prefix: string;
  mainWord: string;
}>();

// Without a prefix the word stands alone and gets huge, so the illustration makes room.
const solo = computed(() => props.prefix === "");
const soloLayout = computed(() => soloWordLayout(props.mainWord));

const prefixSize = computed(() => fitPrefix(props.prefix, 60));
const mainWordSize = computed(() => fitMainWord(props.mainWord, 84));
</script>

<template>
  <svg
    viewBox="0 0 400 566"
    role="img"
    :aria-label="`Theaterplakat: ${prefix} ${mainWord} spielt Die Gerechten von Albert Camus`">
    <rect width="400" height="566" class="fill-on-surface" />

    <g :transform="solo ? 'translate(50 -35) scale(0.7)' : 'translate(0 -60)'">
      <!-- Ground wedge, starting past the poster's left edge -->
      <polygon points="-100,361 190,445 -100,559" class="fill-muted" />

      <!-- The looming bomb, with fuse and spark -->
      <circle cx="235" cy="295" r="110" class="fill-accent" />
      <rect
        x="-20"
        y="-14"
        width="40"
        height="28"
        rx="4"
        transform="translate(308 212) rotate(40)"
        class="fill-accent" />
      <path
        d="M318 200 q 26 -18 14 -40"
        fill="none"
        stroke-width="5"
        stroke-linecap="round"
        class="stroke-surface" />
      <polygon
        points="332,132 337,150 355,155 337,160 332,178 327,160 309,155 327,150"
        class="fill-muted" />

      <!-- The lone figure in hat and coat -->
      <g class="fill-surface">
        <rect x="116" y="262" width="28" height="24" rx="5" />
        <rect x="106" y="282" width="48" height="6" rx="3" />
        <circle cx="130" cy="297" r="13" />
        <path d="M120 312 h20 q10 0 12 10 l8 88 h-60 l8 -88 q2 -10 12 -10 z" />
        <rect x="112" y="408" width="13" height="24" />
        <rect x="135" y="408" width="13" height="24" />
      </g>
    </g>

    <!-- Play -->
    <text x="28" y="50" font-size="28" class="fill-accent font-heading">
      DIE GERECHTEN
    </text>
    <text
      x="28"
      y="72"
      font-size="15"
      font-weight="700"
      class="fill-accent font-heading">
      von Albert Camus
    </text>

    <!-- Theater group: the star of the poster -->
    <g text-anchor="end" class="fill-surface">
      <template v-if="solo">
        <text
          v-for="(line, index) in soloLayout.lines"
          :key="index"
          x="372"
          :y="540 - (soloLayout.lines.length - 1 - index) * soloLayout.lineStep"
          :font-size="soloLayout.fontSize"
          :textLength="soloLayout.textWidth"
          lengthAdjust="spacingAndGlyphs"
          stroke-width="3"
          stroke-linejoin="round"
          class="stroke-surface font-heading">
          {{ line }}
        </text>
      </template>
      <template v-else>
        <text
          x="372"
          y="462"
          :font-size="prefixSize"
          font-weight="900"
          class="font-heading">
          {{ prefix }}
        </text>
        <text
          x="372"
          y="540"
          :font-size="mainWordSize"
          stroke-width="1.5"
          stroke-linejoin="round"
          class="stroke-surface font-heading">
          {{ mainWord }}
        </text>
      </template>
    </g>
  </svg>
</template>
