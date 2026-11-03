<script setup lang="ts">
import { ref } from 'vue'
import { useWordsStore } from '@/stores/words'

const words = useWordsStore()

const prefix = ref('')
const mainWord = ref('')

function pickRandom(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)] ?? ''
}
</script>

<template>
  <div class="grid min-h-dvh grid-rows-[auto_1fr] bg-surface text-on-surface">
    <header class="bg-primary p-6 text-center text-on-primary">
      <h1 class="font-heading text-3xl tracking-wide">Name Shuffle</h1>
    </header>
    <main class="grid place-items-center p-6">
      <div class="grid grid-cols-2 gap-4">
        <output class="font-slot text-2xl">{{ prefix || '—' }}</output>
        <output class="font-slot text-2xl">{{ mainWord || '—' }}</output>
        <button type="button" class="border p-2" @click="prefix = pickRandom(words.prefixes)">
          Prefix mischen
        </button>
        <button type="button" class="border p-2" @click="mainWord = pickRandom(words.mainWords)">
          Name mischen
        </button>
      </div>
    </main>
  </div>
</template>
