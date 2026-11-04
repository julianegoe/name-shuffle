import { watchEffect } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

// The colors for each theme are in assets/main.css
export const THEMES = [
  { id: "pastel", label: "Pastel" },
  { id: "eggshell", label: "Eggshell" },
  { id: "twilight", label: "Twilight" },
  { id: "curtain", label: "Curtain" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const useThemeStore = defineStore("theme", () => {
  const theme = useLocalStorage<ThemeId>("name-shuffle-theme", "pastel");

  watchEffect(() => {
    document.documentElement.dataset.theme = theme.value;
  });

  return { theme };
});
