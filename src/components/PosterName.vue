<script setup lang="ts">
import { computed } from "vue";
import { fitMainWord, fitPrefix, soloWordLayout } from "@/utils/posterWord";

// The group's name on a poster, as SVG text. Without a prefix the word stands alone
// and gets huge. Fill and text-anchor come from the surrounding group.
const props = defineProps<{
  prefix: string;
  mainWord: string;
  x: number;
  prefixY: number;
  mainWordY: number;
  prefixMax: number;
  mainWordMax: number;
  soloY: number;
  soloCentered?: boolean; // soloY is the middle of the text, not its last baseline
}>();

const solo = computed(() => soloWordLayout(props.mainWord));
const soloLastBaseline = computed(() =>
  props.soloCentered ? props.soloY + solo.value.height / 2 : props.soloY,
);
</script>

<template>
  <template v-if="prefix === ''">
    <text
      v-for="(line, index) in solo.lines"
      :key="index"
      :x="x"
      :y="soloLastBaseline - (solo.lines.length - 1 - index) * solo.lineStep"
      :font-size="solo.fontSize"
      :textLength="solo.textWidth"
      lengthAdjust="spacingAndGlyphs"
      stroke-width="3"
      stroke-linejoin="round"
      class="stroke-surface font-heading">
      {{ line }}
    </text>
  </template>
  <template v-else>
    <text
      :x="x"
      :y="prefixY"
      :font-size="fitPrefix(prefix, prefixMax)"
      font-weight="900"
      class="font-heading">
      {{ prefix }}
    </text>
    <text
      :x="x"
      :y="mainWordY"
      :font-size="fitMainWord(mainWord, mainWordMax)"
      stroke-width="1.5"
      stroke-linejoin="round"
      class="stroke-surface font-heading">
      {{ mainWord }}
    </text>
  </template>
</template>
