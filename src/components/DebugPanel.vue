<script setup lang="ts">
import { THEMES, useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <aside
    class="flex flex-wrap items-center justify-center gap-3 border-t-2 border-on-surface bg-surface p-3 text-sm text-on-surface"
    aria-label="Debug panel"
  >
    <h2 class="font-bold">Theme</h2>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="theme in THEMES"
        :key="theme.id"
        type="button"
        class="cursor-pointer rounded-full border-2 border-on-surface px-3 py-1"
        :class="{ 'bg-on-surface text-surface': themeStore.theme === theme.id }"
        :aria-pressed="themeStore.theme === theme.id"
        @click="themeStore.theme = theme.id"
      >
        {{ theme.label }}
      </button>
    </div>
  </aside>
</template>
