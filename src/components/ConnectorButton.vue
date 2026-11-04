<script setup lang="ts">
// A round accent-colored toggle ball with a short word in it, e.g. "und".
// Pass `disabled` and `@click` as usual, they fall through to the button.
defineProps<{
  label: string;
  active: boolean;
}>();
</script>

<template>
  <button
    type="button"
    class="flex cursor-pointer justify-center rounded-full border-2 border-on-surface bg-accent font-slot text-lg px-3 py-1.5 font-bold text-on-surface uppercase transition duration-300 ease-spring hover:scale-110 active:scale-95 disabled:cursor-default disabled:opacity-30 disabled:hover:scale-100"
    :class="active ? 'shadow-md' : 'opacity-50'"
    :aria-pressed="active">
    {{ label }}
  </button>
</template>
