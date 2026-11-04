<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import ConnectorButton from "@/components/ConnectorButton.vue";
import CrossButton from "@/components/CrossButton.vue";
import HintArrow from "@/components/HintArrow.vue";
import PosterCard from "@/components/PosterCard.vue";
import SlotReel from "@/components/SlotReel.vue";
import TheaterPoster from "@/components/TheaterPoster.vue";
import TheaterPosterGeometric from "@/components/TheaterPosterGeometric.vue";
import { CONNECTORS, useShuffledName } from "@/composables/useShuffledName";
import { useFavoritesStore } from "@/stores/favorites";

const POSTERS = [
  { component: TheaterPoster, rotation: "-rotate-2", hint: "" },
  {
    component: TheaterPosterGeometric,
    rotation: "rotate-2",
    hint: "Unser neuer Name",
  },
];

const {
  prefix,
  mainWord,
  prefixEnabled,
  mainWordEnabled,
  hasName,
  chaos,
  reelPrefixes,
  reelMainWords,
  toggleChaos,
  connector,
  connectorsAvailable,
  toggleConnector,
  posterPrefix,
  posterMainWord,
  fullName,
} = useShuffledName();

const favorites = useFavoritesStore();
const isFavorite = computed(() => favorites.names.includes(fullName.value));

const posterHintDismissed = ref(false); // not saved, so the hint is back after a reload

// If nobody clicks a poster soon after a new name, the posters shake once as a hint.
const NUDGE_DELAY_MS = 3000;
const shaking = ref(false);
const { start: startNudgeTimer, stop: stopNudgeTimer } = useTimeoutFn(
  () => {
    shaking.value = true;
  },
  NUDGE_DELAY_MS,
  { immediate: false },
);

function cancelNudge() {
  stopNudgeTimer();
  shaking.value = false;
}

watch([posterPrefix, posterMainWord], () => {
  cancelNudge();
  if (hasName.value) startNudgeTimer();
});
</script>

<template>
  <main class="flex flex-col items-center gap-6 p-6">
    <div
      class="relative my-auto grid w-full max-w-6xl gap-y-3 pt-20 md:grid-cols-2 md:gap-x-10">
      <div class="relative">
        <!-- Shown until the first shuffle -->
        <div
          v-if="!prefix && !mainWord && prefixEnabled"
          class="absolute bottom-full left-4 flex items-center gap-2 md:left-8">
          <HintArrow class="w-10 rotate-26" />
          <span class="-rotate-6 font-slot text-xl font-bold md:text-2xl">
            Shuffle
          </span>
        </div>
        <SlotReel
          :key="`prefix-${chaos}`"
          v-model="prefix"
          v-model:enabled="prefixEnabled"
          :words="reelPrefixes"
          :locked="!mainWordEnabled"
          name="Erstes Wort"
          word-class="text-accent"
          @spin-start="cancelNudge" />
      </div>
      <!-- Between the reels when they are stacked, centered above them side by side -->
      <div
        class="flex justify-center gap-3 md:absolute md:top-5 md:left-1/2 md:-translate-x-1/2">
        <ConnectorButton
          v-for="word in CONNECTORS"
          :key="word"
          :label="word"
          :active="connector === word && connectorsAvailable"
          :disabled="!connectorsAvailable"
          @click="toggleConnector(word)" />
        <ConnectorButton
          label="😈 Chaos"
          :active="chaos"
          @click="toggleChaos" />
      </div>
      <SlotReel
        :key="`main-${chaos}`"
        v-model="mainWord"
        v-model:enabled="mainWordEnabled"
        :words="reelMainWords"
        :locked="!prefixEnabled"
        name="Zweites Wort"
        word-class="text-highlight"
        @spin-start="cancelNudge" />
    </div>
    <!-- Always takes up its space, so nothing jumps when a name is ready -->
    <button
      type="button"
      class="flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 font-bold text-on-primary transition duration-300 ease-spring hover:scale-105 active:scale-95"
      :class="{ invisible: !hasName }"
      :aria-pressed="isFavorite"
      @click="favorites.toggle(fullName)">
      ⭐️
      {{ isFavorite ? "Gemerkt" : "Merken" }}
    </button>
    <div class="flex flex-wrap items-end justify-center gap-8">
      <div v-for="poster in POSTERS" :key="poster.rotation" class="relative">
        <!-- Above the poster on small screens, beside it where there is room -->
        <div
          v-if="poster.hint && !posterHintDismissed"
          class="mb-2 flex flex-col items-center gap-1 xl:absolute xl:top-14 xl:left-full xl:mb-0 xl:ml-6 xl:w-64 xl:flex-row-reverse xl:justify-end xl:gap-3">
          <div class="flex items-start gap-1">
            <span
              class="-rotate-3 text-center font-slot text-2xl leading-tight font-bold md:text-3xl xl:text-left xl:text-2xl">
              {{ poster.hint }}
            </span>
            <CrossButton
              class="size-6"
              label="Hinweis schließen"
              @click="posterHintDismissed = true" />
          </div>
          <HintArrow class="w-12 shrink-0 xl:rotate-90" />
        </div>
        <PosterCard
          :poster="poster.component"
          :rotation="poster.rotation"
          :prefix="posterPrefix"
          :main-word="posterMainWord"
          :visible="hasName"
          :shaking="shaking"
          @flip="cancelNudge"
          @shake-end="shaking = false" />
      </div>
    </div>
  </main>
</template>
