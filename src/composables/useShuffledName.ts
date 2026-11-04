import { computed, ref } from "vue";
import { useWordsStore } from "@/stores/words";
import { bestPartners, blendName } from "@/utils/neologism";
import { allParts, firstParts } from "@/utils/wordParts";

export const CONNECTORS = ["und", "aber"] as const;
type Connector = (typeof CONNECTORS)[number];

// The state of the two reels and the name the posters show for it.
export function useShuffledName() {
  const words = useWordsStore();

  const prefix = ref("");
  const mainWord = ref("");
  const prefixEnabled = ref(true);
  const mainWordEnabled = ref(true);
  const bothEnabled = computed(
    () => prefixEnabled.value && mainWordEnabled.value,
  );
  const hasName = computed(
    () =>
      (!prefixEnabled.value || prefix.value !== "") &&
      (!mainWordEnabled.value || mainWord.value !== ""),
  );

  // Chaos mode: the reels shuffle word pieces, and the two form one new word.
  const chaos = ref(false);
  const takenNames = computed(
    () =>
      new Set(
        [...words.prefixes, ...words.mainWords].flatMap((entry) =>
          entry.toLowerCase().split(/\s+/),
        ),
      ),
  );
  // Once one reel has landed, the other only offers pieces that sound good with it.
  const reelPrefixes = computed(() => {
    if (!chaos.value) return words.prefixes;
    const pieces = firstParts(words.prefixes);
    return mainWord.value && mainWordEnabled.value
      ? bestPartners(mainWord.value, pieces, false, takenNames.value)
      : pieces;
  });
  const reelMainWords = computed(() => {
    if (!chaos.value) return words.mainWords;
    const pieces = allParts(words.mainWords);
    return prefix.value && prefixEnabled.value
      ? bestPartners(prefix.value, pieces, true, takenNames.value)
      : pieces;
  });

  function toggleChaos() {
    chaos.value = !chaos.value;
    // Whole entries and pieces don't mix, so both modes start empty
    prefix.value = "";
    mainWord.value = "";
  }

  // A connector word goes between the two words on the posters. Only one at a time.
  const connector = ref<Connector | "">("");
  const connectorsAvailable = computed(() => bothEnabled.value && !chaos.value);

  function toggleConnector(word: Connector) {
    connector.value = connector.value === word ? "" : word;
  }

  // With one reel switched off, the remaining word takes the main spot on the posters.
  const posterPrefix = computed(() => {
    if (!connectorsAvailable.value) return "";
    return connector.value && prefix.value
      ? `${prefix.value} ${connector.value}`
      : prefix.value;
  });
  const posterMainWord = computed(() => {
    const first = prefixEnabled.value ? prefix.value : "";
    const second = mainWordEnabled.value ? mainWord.value : "";
    if (chaos.value && first && second) return blendName(first, second);
    return second || first;
  });

  return {
    prefix,
    mainWord,
    prefixEnabled,
    mainWordEnabled,
    hasName,
    chaos,
    reelPrefixes,
    reelMainWords,
    toggleChaos,
    connector,
    connectorsAvailable,
    toggleConnector,
    posterPrefix,
    posterMainWord,
  };
}
