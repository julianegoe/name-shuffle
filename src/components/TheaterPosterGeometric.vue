<script setup lang="ts">
import PosterName from "@/components/PosterName.vue";

defineProps<{
  prefix: string;
  mainWord: string;
}>();
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
      <PosterName
        :prefix="prefix"
        :main-word="mainWord"
        :x="28"
        :prefix-y="372"
        :main-word-y="470"
        :prefix-max="64"
        :main-word-max="96"
        :solo-y="407"
        solo-centered />
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
