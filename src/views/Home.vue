<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import FlipCard from "@/components/FlipCard.vue";
import InstagramPostMock from "@/components/InstagramPostMock.vue";
import SlotReel from "@/components/SlotReel.vue";
import TheaterPoster from "@/components/TheaterPoster.vue";
import TheaterPosterGeometric from "@/components/TheaterPosterGeometric.vue";
import { useWordsStore } from "@/stores/words";

const POSTERS = [
  { component: TheaterPoster, rotation: "-rotate-2" },
  { component: TheaterPosterGeometric, rotation: "rotate-2" },
];
const POSTER_CLASS =
  "absolute inset-0 size-full origin-bottom transition duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-103 motion-reduce:transition-none";
const POSTER_HIDDEN_CLASS = "invisible translate-y-8 scale-75 opacity-0";

const words = useWordsStore();

const prefix = ref("");
const mainWord = ref("");
const prefixEnabled = ref(true);
const mainWordEnabled = ref(true);

const hasName = computed(
  () =>
    (!prefixEnabled.value || prefix.value !== "") &&
    (!mainWordEnabled.value || mainWord.value !== ""),
);
// With one reel switched off, the remaining word takes the main spot on the posters.
const posterPrefix = computed(() =>
  prefixEnabled.value && mainWordEnabled.value ? prefix.value : "",
);
const posterMainWord = computed(() =>
  mainWordEnabled.value ? mainWord.value : prefix.value,
);

// If nobody clicks a poster within 5 seconds of a new name, the posters shake once as a hint.
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
      class="grid w-full max-w-6xl gap-10 self-center justify-self-center md:grid-cols-2">
      <SlotReel
        v-model="prefix"
        v-model:enabled="prefixEnabled"
        :words="words.prefixes"
        :locked="!mainWordEnabled"
        name="Prefix"
        word-class="text-accent"
        @spin-start="cancelNudge" />
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
    <div class="flex flex-wrap justify-center gap-8 justify-self-center">
      <div
        v-for="poster in POSTERS"
        :key="poster.rotation"
        class="relative aspect-[400/566] w-56 md:w-80">
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
  </main>
</template>
