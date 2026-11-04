<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import DebugPanel from "@/components/DebugPanel.vue";

const showDebugPanel = import.meta.env.DEV;
const NAV_LINKS = [
  { to: "/", label: "Name Shuffle" },
  { to: "/admin", label: "Wörter hinzufügen" },
];
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-surface text-on-surface">
    <header
      class="flex items-center justify-between gap-2 bg-primary px-4 py-2 text-center text-on-primary">
      <nav class="flex items-center gap-4 text-sm">
        <RouterLink
          v-for="link in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          class="rounded-full border border-on-primary px-3 py-1"
          active-class="bg-on-primary text-on-surface">
          {{ link.label }}
        </RouterLink>
      </nav>
      <div v-if="showDebugPanel" class="flex items-center gap-4">
        <span class="text-sm">Theme:</span>
        <DebugPanel class="md:justify-end" />
      </div>
    </header>
    <RouterView class="grow" />
  </div>
</template>
