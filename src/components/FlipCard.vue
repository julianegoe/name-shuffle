<script setup lang="ts">
import { ref } from 'vue'

const flipped = ref(false)
</script>

<template>
  <button
    type="button"
    class="block cursor-pointer perspective-[1400px]"
    :aria-label="flipped ? 'Zurück zum Plakat' : 'Plakat umdrehen'"
    :aria-pressed="flipped"
    @click="flipped = !flipped"
  >
    <span
      class="relative block size-full transition-transform duration-700 ease-in-out transform-3d motion-reduce:duration-0"
      :class="{ 'rotate-y-180': flipped }"
    >
      <span class="absolute inset-0 block backface-hidden" :aria-hidden="flipped">
        <slot name="front" />
      </span>
      <span class="absolute inset-0 block rotate-y-180 backface-hidden" :aria-hidden="!flipped">
        <slot name="back" />
      </span>
    </span>
  </button>
</template>
