<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import FlipCard from "@/components/FlipCard.vue";
import HintArrow from "@/components/HintArrow.vue";
import InstagramPostMock from "@/components/InstagramPostMock.vue";
import SlotReel from "@/components/SlotReel.vue";
import TheaterPoster from "@/components/TheaterPoster.vue";
import TheaterPosterGeometric from "@/components/TheaterPosterGeometric.vue";
import { useWordsStore } from "@/stores/words";

const POSTERS = [
  { component: TheaterPoster, rotation: "-rotate-2", hint: "" },
  {
    component: TheaterPosterGeometric,
    rotation: "rotate-2",
    hint: "Unser neuer Name",
  },
];
const POSTER_CLASS =
  "absolute inset-0 size-full origin-bottom transition duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-103 motion-reduce:transition-none";
const POSTER_HIDDEN_CLASS = "invisible translate-y-8 scale-75 opacity-0";

const words = useWordsStore();
const posterHintDismissed = ref(false); // not saved, so the hint is back after a reload

const prefix = ref("");
const mainWord = ref("");
const prefixEnabled = ref(true);
const mainWordEnabled = ref(true);
const bothEnabled = computed(
  () => prefixEnabled.value && mainWordEnabled.value,
);
const withUnd = ref(false); // puts "und" between the two words on the posters

const hasName = computed(
  () =>
    (!prefixEnabled.value || prefix.value !== "") &&
    (!mainWordEnabled.value || mainWord.value !== ""),
);
// With one reel switched off, the remaining word takes the main spot on the posters.
const posterPrefix = computed(() => {
  if (!bothEnabled.value) return "";
  return withUnd.value && prefix.value ? `${prefix.value} und` : prefix.value;
});
const posterMainWord = computed(() =>
  mainWordEnabled.value ? mainWord.value : prefix.value,
);

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
  <main class="grid grid-rows-[1fr_auto] gap-6 p-6">
    <div
      class="relative grid w-full max-w-6xl gap-10 self-center justify-self-center pt-20 md:grid-cols-2">
      <button
        type="button"
        class="absolute text-xl uppercase top-3 left-1/2 grid size-16 -translate-x-1/2 cursor-pointer place-items-center rounded-full border-2 bg-accent font-slot font-bold text-on-surface transition duration-300 ease-[cubic-bezier(0.34,1.8,0.64,1)] hover:scale-110 active:scale-95 disabled:cursor-default disabled:opacity-30 disabled:hover:scale-100 md:top-5"
        :class="
          withUnd && bothEnabled
            ? 'border-on-surface shadow-md'
            : 'border-accent opacity-50'
        "
        :aria-pressed="withUnd"
        :disabled="!bothEnabled"
        @click="withUnd = !withUnd">
        und
      </button>
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
          v-model="prefix"
          v-model:enabled="prefixEnabled"
          :words="words.prefixes"
          :locked="!mainWordEnabled"
          name="Prefix"
          word-class="text-accent"
          @spin-start="cancelNudge" />
      </div>
      <SlotReel
        v-model="mainWord"
        v-model:enabled="mainWordEnabled"
        :words="words.mainWords"
        :locked="!prefixEnabled"
        name="Name"
        word-class="text-highlight"
        @spin-start="cancelNudge" />
    </div>
    <!-- Empty boxes hold the posters' space until there is a name, so nothing jumps -->
    <div
      class="flex flex-wrap items-end justify-center gap-8 justify-self-center">
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
            <button
              type="button"
              class="grid size-6 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-on-surface"
              aria-label="Hinweis schließen"
              title="Hinweis schließen"
              @click="posterHintDismissed = true">
              <svg
                class="size-3"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" />
              </svg>
            </button>
          </div>
          <HintArrow class="w-12 shrink-0 xl:rotate-90" />
        </div>
        <div class="relative aspect-[400/566] w-56 md:w-80">
          <div
            v-if="!hasName"
            class="absolute inset-0 origin-bottom border-2 border-dashed border-on-surface/30"
            :class="poster.rotation"></div>
          <!-- Click a poster to flip it: its back shows it as an Instagram post -->
          <FlipCard
            :class="[
              POSTER_CLASS,
              poster.rotation,
              {
                [POSTER_HIDDEN_CLASS]: !hasName,
                'motion-safe:animate-shake': shaking,
              },
            ]"
            @click="cancelNudge"
            @animationend="shaking = false">
            <template #front>
              <component
                :is="poster.component"
                class="size-full shadow-xl"
                :prefix="posterPrefix"
                :main-word="posterMainWord" />
            </template>
            <template #back>
              <InstagramPostMock
                class="size-full drop-shadow-xl"
                :prefix="posterPrefix"
                :main-word="posterMainWord">
                <template #default="box">
                  <component
                    :is="poster.component"
                    v-bind="box"
                    :prefix="posterPrefix"
                    :main-word="posterMainWord" />
                </template>
              </InstagramPostMock>
            </template>
          </FlipCard>
        </div>
      </div>
    </div>
  </main>
</template>
