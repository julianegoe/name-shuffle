<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import DebugPanel from '@/components/DebugPanel.vue'

const showDebugPanel = import.meta.env.DEV
</script>

<template>
  <div class="grid min-h-dvh grid-rows-[auto_1fr] bg-surface text-on-surface">
    <header
      class="grid items-center gap-1 bg-primary px-4 py-1.5 text-center text-on-primary md:grid-cols-[1fr_auto_1fr]"
    >
      <nav class="text-sm md:justify-self-start">
        <RouterLink to="/admin" class="hover:underline" active-class="underline">Admin</RouterLink>
      </nav>
      <h1 class="font-heading text-base tracking-wide">
        <RouterLink to="/">Name Shuffle</RouterLink>
      </h1>
      <DebugPanel v-if="showDebugPanel" class="md:justify-end" />
    </header>
    <RouterView />
  </div>
</template>
