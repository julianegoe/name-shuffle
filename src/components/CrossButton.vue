<script setup lang="ts">
// A round button with an × in it, or a + with `plus`. Set its size with a size class.
// The icon scales with it. `disabled` and `@click` fall through to the button.
defineProps<{
  label: string;
  plus?: boolean;
}>();
</script>

<template>
  <button
    type="button"
    class="grid shrink-0 cursor-pointer place-items-center rounded-full border-2 border-on-surface transition-colors hover:bg-on-surface hover:text-surface disabled:cursor-default disabled:hover:bg-surface"
    :aria-label="label"
    :title="label">
    <svg
      class="size-1/2 transition-transform"
      :class="{ 'rotate-45': !plus }"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      aria-hidden="true">
      <path d="M8 2v12M2 8h12" />
    </svg>
  </button>
</template>
