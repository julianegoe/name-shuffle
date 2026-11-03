import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'

// The colors for each theme are in assets/main.css
export const THEMES = [
  { id: 'pastel', label: 'Pastel' },
  { id: 'eggshell', label: 'Eggshell' },
  { id: 'twilight', label: 'Twilight' },
  { id: 'curtain', label: 'Curtain' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

const STORAGE_KEY = 'name-shuffle-theme'

function loadTheme(): ThemeId {
  const saved = localStorage.getItem(STORAGE_KEY)
  return THEMES.find((theme) => theme.id === saved)?.id ?? 'pastel'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeId>(loadTheme())

  watchEffect(() => {
    document.documentElement.dataset.theme = theme.value
    localStorage.setItem(STORAGE_KEY, theme.value)
  })

  return { theme }
})
