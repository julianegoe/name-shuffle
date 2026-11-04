<script setup lang="ts">
import { reactive } from 'vue'
import { useWordsStore, type WordList } from '@/stores/words'

const words = useWordsStore()

const LISTS: { id: WordList; title: string }[] = [
  { id: 'prefixes', title: 'Prefixe' },
  { id: 'mainWords', title: 'Namen' },
]

const drafts = reactive<Record<WordList, string>>({ prefixes: '', mainWords: '' })
const errors = reactive<Record<WordList, string>>({ prefixes: '', mainWords: '' })

function save(list: WordList) {
  if (words.addWord(list, drafts[list])) {
    drafts[list] = ''
    errors[list] = ''
  } else {
    errors[list] = drafts[list].trim() === '' ? 'Bitte ein Wort eingeben.' : 'Das Wort gibt es schon.'
  }
}
</script>

<template>
  <main class="grid content-start justify-items-center p-6">
    <div class="grid w-full max-w-4xl gap-10 md:grid-cols-2">
      <section v-for="list in LISTS" :key="list.id" class="grid content-start gap-4">
        <h2 class="font-heading text-2xl">{{ list.title }}</h2>
        <form class="flex gap-2" novalidate @submit.prevent="save(list.id)">
          <input
            v-model="drafts[list.id]"
            type="text"
            :aria-label="`Neues Wort für ${list.title}`"
            placeholder="Neues Wort"
            class="min-w-0 flex-1 rounded-full border-2 border-on-surface bg-surface px-4 py-2"
          />
          <button
            type="submit"
            class="cursor-pointer rounded-full bg-primary px-4 py-2 font-bold text-on-primary"
          >
            Speichern
          </button>
        </form>
        <p v-if="errors[list.id]" role="alert" class="text-sm">{{ errors[list.id] }}</p>
        <ul class="grid gap-x-4 gap-y-1" :class="{ 'grid-cols-2': list.id === 'mainWords' }">
          <li v-for="word in words[list.id]" :key="word" class="flex items-center gap-2">
            <button
              type="button"
              class="grid size-5 shrink-0 cursor-pointer place-items-center rounded-full border border-on-surface hover:bg-on-surface hover:text-surface"
              :aria-label="`${word} löschen`"
              :title="`${word} löschen`"
              @click="words.removeWord(list.id, word)"
            >
              <svg
                class="size-2.5"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
              </svg>
            </button>
            {{ word }}
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>
