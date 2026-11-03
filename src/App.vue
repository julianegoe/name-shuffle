<script setup lang="ts">
import { RouterView } from 'vue-router'
import DebugPanel from '@/components/DebugPanel.vue'

const showDebugPanel = import.meta.env.DEV
</script>

<template>
  <div class="grid min-h-dvh grid-rows-[1fr_auto]">
    <RouterView />
    <DebugPanel v-if="showDebugPanel" />
  </div>
</template>
