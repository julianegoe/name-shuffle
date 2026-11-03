<script setup lang="ts">
import SlotReel from '@/components/SlotReel.vue'
import { useWordsStore } from '@/stores/words'

const words = useWordsStore()
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] bg-surface text-on-surface">
    <header class="bg-primary p-4 text-center text-on-primary md:p-6">
      <h1 class="font-heading text-2xl tracking-wide md:text-3xl">Name Shuffle</h1>
    </header>
    <main class="grid place-items-center p-6">
      <div class="grid w-full max-w-6xl gap-10 md:grid-cols-2">
        <SlotReel :words="words.prefixes" label="Prefix mischen" word-class="text-accent" />
        <SlotReel :words="words.mainWords" label="Name mischen" word-class="text-highlight" />
      </div>
    </main>
  </div>
</template>
