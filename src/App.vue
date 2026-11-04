<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import DebugPanel from "@/components/DebugPanel.vue";

const showDebugPanel = import.meta.env.DEV;
</script>

<template>
  <div class="grid min-h-dvh grid-rows-[auto_1fr] bg-surface text-on-surface">
    <header
      class="flex items-center gap-2 bg-primary px-4 py-2 text-center text-on-primary justify-between">
      <nav class="flex gap-4 items-center text-sm md:justify-self-start">
        <RouterLink
          class="rounded-full px-3 py-1 border border-on-primary"
          active-class="bg-on-primary text-on-surface border-on-primary"
          to="/"
          >Name Shuffle</RouterLink
        >
        <RouterLink
          to="/admin"
          class="rounded-full px-3 py-1 border border-on-primary"
          active-class="bg-on-primary text-on-surface border-on-primary"
          >Wörter hinzufügen</RouterLink
        >
      </nav>
      <div class="flex gap-4 items-center">
        <span class="text-sm">Theme:</span>
        <DebugPanel v-if="showDebugPanel" class="md:justify-end" />
      </div>
    </header>
    <RouterView />
  </div>
</template>
