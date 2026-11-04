<script setup lang="ts">
import CrossButton from "@/components/CrossButton.vue";
import { useFavoritesStore } from "@/stores/favorites";

const favorites = useFavoritesStore();
</script>

<template>
  <main class="flex flex-col items-center p-6">
    <div class="grid w-full max-w-2xl gap-4">
      <h2 class="font-heading text-2xl">Favoriten</h2>
      <p v-if="favorites.names.length === 0">
        Noch keine Favoriten. Mische einen Namen und merke ihn dir mit dem Herz.
      </p>
      <ul class="grid gap-2">
        <li
          v-for="name in favorites.names"
          :key="name"
          class="flex items-center justify-between gap-4 rounded-full border-2 border-on-surface py-2 pr-2 pl-6">
          <span class="font-slot text-2xl font-bold">{{ name }}</span>
          <CrossButton
            class="size-8"
            :label="`${name} entfernen`"
            @click="favorites.remove(name)" />
        </li>
      </ul>
    </div>
  </main>
</template>
