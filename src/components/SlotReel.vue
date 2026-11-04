<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'

const props = defineProps<{
  words: string[]
  name: string
  wordClass: string
  locked: boolean // can't be switched off, e.g. because it's the last one on
}>()

const emit = defineEmits<{
  spinStart: []
}>()

const PLACEHOLDER = '—'
const MIN_STEPS = 30 // words the reel passes per spin, at least
const DURATION_MS = 2500
const OVERSHOOT = 0.15 // how far past the word it bounces, in word heights

const word = defineModel<string>({ default: '' })
const enabled = defineModel<boolean>('enabled', { default: true })
const reel = ref([PLACEHOLDER])
const spinning = ref(false)
const strip = useTemplateRef<HTMLElement>('strip')

async function spin() {
  const candidates = props.words.filter((candidate) => candidate !== word.value)
  const target = candidates[Math.floor(Math.random() * candidates.length)]
  if (target === undefined) return

  emit('spinStart')

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    spinning.value = true

    // Rotate the list so it ends on the target, then repeat it to get the length of the spin.
    const index = props.words.indexOf(target)
    const order = [...props.words.slice(index + 1), ...props.words.slice(0, index + 1)]
    const steps = Array.from({ length: Math.ceil(MIN_STEPS / order.length) }, () => order).flat()

    // The word after the target is what shows during the overshoot.
    reel.value = [word.value || PLACEHOLDER, ...steps, ...order.slice(0, 1)]
    await nextTick()

    const height = strip.value?.firstElementChild?.getBoundingClientRect().height ?? 0
    const animation = strip.value?.animate(
      [
        { transform: 'translateY(0)', easing: 'cubic-bezier(0.15, 0.75, 0.25, 1)' },
        {
          transform: `translateY(${-(steps.length + OVERSHOOT) * height}px)`,
          offset: 0.9,
          easing: 'ease-in-out',
        },
        { transform: `translateY(${-steps.length * height}px)` },
      ],
      { duration: DURATION_MS, fill: 'forwards' },
    )
    await animation?.finished
    animation?.cancel()
    spinning.value = false
  }

  word.value = target
  reel.value = [target]
}
</script>

<template>
  <div class="relative w-full">
    <div
      class="dotted-shadow rounded-full transition-opacity"
      :class="{ 'opacity-30': !enabled }"
    >
    <div
      class="relative h-(--reel-item) overflow-hidden rounded-full border-4 border-on-surface bg-surface text-[clamp(1.75rem,9vw,2.5rem)] [--reel-item:calc(1.2em+3.5rem)] md:text-[clamp(2rem,4vw,3.5rem)]"
    >
      <div ref="strip" aria-hidden="true">
        <div
          v-for="(item, index) in reel"
          :key="index"
          class="@container flex h-(--reel-item) items-center justify-center pr-4 pl-18 font-slot md:pr-8 md:pl-22 leading-none font-bold whitespace-nowrap"
          :class="wordClass"
        >
          <!-- Long words shrink to fit: width available / estimated width of the word in em -->
          <span
            class="[font-size:min(1em,calc(100cqw/(var(--letters)*0.6)))]"
            :style="{ '--letters': item.length }"
          >
            {{ item }}
          </span>
        </div>
      </div>
      <button
        type="button"
        class="group absolute top-1/2 left-3 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-primary text-on-primary disabled:cursor-default md:left-4 md:size-14"
        :aria-label="`${name} mischen`"
        :title="`${name} mischen`"
        :disabled="spinning || !enabled"
        @click="spin"
      >
        <!-- A tilted die: wobbles on hover, tumbles while the reel spins -->
        <svg
          class="size-8 -rotate-12 transition-transform duration-300 ease-[cubic-bezier(0.34,1.8,0.64,1)] group-hover:rotate-12 group-active:scale-90"
          :class="{ 'animate-spin': spinning }"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2.5" />
          <circle cx="8.5" cy="8.5" r="1.7" />
          <circle cx="15.5" cy="8.5" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="8.5" cy="15.5" r="1.7" />
          <circle cx="15.5" cy="15.5" r="1.7" />
        </svg>
      </button>
    </div>
    </div>
    <!-- On/off switch, sits on the pill's outline -->
    <button
      type="button"
      class="absolute -top-2 right-8 grid size-8 cursor-pointer place-items-center rounded-full border-2 border-on-surface bg-surface text-on-surface transition-opacity disabled:cursor-default disabled:border-on-surface/30 disabled:text-on-surface/30 md:right-10"
      :class="{ 'pointer-events-none opacity-0': spinning }"
      :aria-label="`${name} ${enabled ? 'ausschalten' : 'einschalten'}`"
      :title="`${name} ${enabled ? 'ausschalten' : 'einschalten'}`"
      :aria-pressed="enabled"
      :disabled="spinning || (enabled && locked)"
      @click="enabled = !enabled"
    >
      <svg
        class="size-4 transition-transform"
        :class="{ 'rotate-45': enabled }"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M8 2v12M2 8h12" />
      </svg>
    </button>
    <output v-if="enabled" class="sr-only">{{ word }}</output>
  </div>
</template>
