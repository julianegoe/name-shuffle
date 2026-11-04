<script setup lang="ts">
import { THEMES, useThemeStore } from "@/stores/theme";

const themeStore = useThemeStore();
</script>

<template>
  <div
    class="flex flex-wrap justify-center gap-1.5 text-xs text-on-primary sm:gap-3.5"
    role="group"
    aria-label="Theme">
    <button
      v-for="theme in THEMES"
      :key="theme.id"
      type="button"
      class="cursor-pointer rounded-full border border-on-primary px-2 py-0.5"
      :class="{ 'bg-on-primary text-primary': themeStore.theme === theme.id }"
      :aria-pressed="themeStore.theme === theme.id"
      @click="themeStore.theme = theme.id">
      {{ theme.label }}
    </button>
  </div>
</template>
