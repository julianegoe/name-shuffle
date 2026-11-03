import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWordsStore = defineStore('words', () => {
  const prefixes = ref(['Kollektiv', 'Ensemble', 'Team', 'Gruppe', 'Theater', 'Zirkel', 'Truppe'])
  const mainWords = ref(['Resonanz', 'am Limit', 'Amplitude', 'Geräusch', 'Widerhall'])

  return { prefixes, mainWords }
})
