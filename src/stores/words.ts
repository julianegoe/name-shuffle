import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

const STORAGE_KEY = 'name-shuffle-words'

export type WordList = 'prefixes' | 'mainWords'

const DEFAULTS: Record<WordList, string[]> = {
  prefixes: ['Kollektiv', 'Ensemble', 'Team', 'Gruppe', 'Theater', 'Zirkel', 'Truppe'],
  mainWords: [
    'Resonanz',
    'am Limit',
    'Amplitude',
    'Geräusch',
    'Widerhall',
    'Limit',
    'Resonanzfabrik',
    'Resonanzwerk',
    'Frequemble',
    'Neue Resonanz',
    'Team Theatrale',
    'Neue Frequenz',
    'Resonanzbereit',
    'Ping Pong',
    'Kritikunfähig',
    'Kloppraum',
    'Resonanzzirkel',
    'Konfrontativ',
    'Unangenehmt',
    'Diskurs',
    'Konfrontation',
    'Konfrontare',
    'Die Konfrontäre',
    'Die Resonäre',
    'Resonanzberg',
    'Stets bemüht',
    'Systemresonant',
    'Überwiegend Vibelig',
  ],
}

export const useWordsStore = defineStore('words', () => {
  // Only added words are saved. Deleted hard-coded words are only remembered
  // in memory, so they come back on reload.
  const added = useLocalStorage<Record<WordList, string[]>>(
    STORAGE_KEY,
    { prefixes: [], mainWords: [] },
    { mergeDefaults: true },
  )
  const removedDefaults = ref<Record<WordList, string[]>>({ prefixes: [], mainWords: [] })

  function wordsOf(list: WordList): string[] {
    return [
      ...DEFAULTS[list].filter((word) => !removedDefaults.value[list].includes(word)),
      ...added.value[list].filter((word) => !DEFAULTS[list].includes(word)),
    ]
  }

  const prefixes = computed(() => wordsOf('prefixes'))
  const mainWords = computed(() => wordsOf('mainWords'))

  // Returns false if the word is empty or the list already has it.
  function addWord(list: WordList, word: string): boolean {
    const trimmed = word.trim()
    const lower = trimmed.toLowerCase()
    if (trimmed === '' || wordsOf(list).some((item) => item.toLowerCase() === lower)) return false

    if (DEFAULTS[list].includes(trimmed)) {
      removedDefaults.value[list] = removedDefaults.value[list].filter((item) => item !== trimmed)
    } else {
      added.value[list].push(trimmed)
    }
    return true
  }

  function removeWord(list: WordList, word: string) {
    if (DEFAULTS[list].includes(word)) {
      removedDefaults.value[list].push(word)
    } else {
      added.value[list] = added.value[list].filter((item) => item !== word)
    }
  }

  return { prefixes, mainWords, addWord, removeWord }
})
