<script setup lang="ts">
import type { Component } from "vue";
import FlipCard from "@/components/FlipCard.vue";
import InstagramPostMock from "@/components/InstagramPostMock.vue";

// A poster that flips to show itself as an Instagram post. Until it's `visible`,
// an empty box holds its space, so nothing jumps when it appears.
defineProps<{
  poster: Component;
  rotation: string;
  prefix: string;
  mainWord: string;
  visible: boolean;
  shaking: boolean;
}>();

defineEmits<{
  flip: [];
  shakeEnd: [];
}>();
</script>

<template>
  <div class="relative aspect-poster w-56 md:w-80">
    <div
      v-if="!visible"
      class="absolute inset-0 origin-bottom border-2 border-dashed border-on-surface/30"
      :class="rotation"></div>
    <FlipCard
      class="absolute inset-0 size-full origin-bottom transition duration-500 ease-spring hover:scale-105 motion-reduce:transition-none"
      :class="[
        rotation,
        {
          'invisible translate-y-8 scale-75 opacity-0': !visible,
          'motion-safe:animate-shake': shaking,
        },
      ]"
      @click="$emit('flip')"
      @animationend="$emit('shakeEnd')">
      <template #front>
        <component
          :is="poster"
          class="size-full shadow-xl"
          :prefix="prefix"
          :main-word="mainWord" />
      </template>
      <template #back>
        <InstagramPostMock
          class="size-full drop-shadow-xl"
          :prefix="prefix"
          :main-word="mainWord">
          <template #default="box">
            <component
              :is="poster"
              v-bind="box"
              :prefix="prefix"
              :main-word="mainWord" />
          </template>
        </InstagramPostMock>
      </template>
    </FlipCard>
  </div>
</template>
