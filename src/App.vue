<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import DebugPanel from "@/components/DebugPanel.vue";

const showDebugPanel = import.meta.env.DEV;
const NAV_LINKS = [
  { to: "/", label: "Name Shuffle" },
  { to: "/admin", label: "Wörter hinzufügen" },
  { to: "/favorites", label: "Favoriten" },
];
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-surface text-on-surface">
    <header
      class="flex flex-col items-center gap-2 bg-primary px-4 py-2 text-center text-on-primary lg:flex-row lg:justify-between">
      <nav class="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:gap-4 sm:text-sm">
        <RouterLink
          v-for="link in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          class="rounded-full border border-on-primary px-2.5 py-1 sm:px-3"
          active-class="bg-on-primary text-on-surface">
          {{ link.label }}
        </RouterLink>
      </nav>
      <div v-if="showDebugPanel" class="flex items-center gap-4">
        <span class="hidden text-sm sm:inline">Theme:</span>
        <DebugPanel class="md:justify-end" />
      </div>
    </header>
    <RouterView class="grow" />
  </div>
</template>
