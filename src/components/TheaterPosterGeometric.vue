<script setup lang="ts">
import { computed } from "vue";
import { fitMainWord, fitPrefix, soloWordLayout } from "@/utils/posterWord";

const props = defineProps<{
  prefix: string;
  mainWord: string;
}>();

// Without a prefix the word stands alone and gets huge.
const solo = computed(() => props.prefix === "");
const soloLayout = computed(() => soloWordLayout(props.mainWord));
// The solo word sits centered between the tiles and the play line.
const soloFirstBaseline = computed(
  () => 407 - soloLayout.value.height / 2 + soloLayout.value.capHeight,
);

const prefixSize = computed(() => fitPrefix(props.prefix, 64));
const mainWordSize = computed(() => fitMainWord(props.mainWord, 96));
</script>

<template>
  <svg
    viewBox="0 0 400 566"
    role="img"
    :aria-label="`Plakat: ${prefix} ${mainWord} spielt Die Gerechten von Albert Camus`">
    <rect width="400" height="566" class="fill-on-surface" />

    <!-- Geometric tiles, 4 x 3 at 100 each -->
    <path d="M0 0 H100 A100 100 0 0 1 0 100 Z" class="fill-accent" />
    <circle cx="150" cy="50" r="50" class="fill-muted" />
    <rect x="200" width="100" height="100" class="fill-surface" />
    <circle cx="250" cy="50" r="25" class="fill-on-surface" />
    <path d="M300 100 L400 0 V100 Z" class="fill-accent" />

    <path d="M0 200 A50 50 0 0 1 100 200 Z" class="fill-surface" />
    <rect x="100" y="100" width="100" height="100" class="fill-accent" />
    <path d="M200 200 V100 A100 100 0 0 1 300 200 Z" class="fill-muted" />
    <circle cx="350" cy="150" r="50" class="fill-surface" />

    <path d="M0 200 H100 L0 300 Z" class="fill-muted" />
    <path d="M200 200 V300 A100 100 0 0 1 100 200 Z" class="fill-surface" />
    <circle cx="250" cy="250" r="50" class="fill-accent" />
    <rect x="300" y="200" width="100" height="100" class="fill-muted" />

    <!-- Theater group: the star of the poster -->
    <g class="fill-surface">
      <template v-if="solo">
        <text
          v-for="(line, index) in soloLayout.lines"
          :key="index"
          x="28"
          :y="soloFirstBaseline + index * soloLayout.lineStep"
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
          x="28"
          y="372"
          :font-size="prefixSize"
          font-weight="900"
          class="font-heading">
          {{ prefix }}
        </text>
        <text
          x="28"
          y="470"
          :font-size="mainWordSize"
          stroke-width="1.5"
          stroke-linejoin="round"
          class="stroke-surface font-heading">
          {{ mainWord }}
        </text>
      </template>
      <text
        x="28"
        y="530"
        font-size="14"
        font-weight="700"
        class="font-heading">
        Die Gerechten · Albert Camus
      </text>
    </g>
  </svg>
</template>
