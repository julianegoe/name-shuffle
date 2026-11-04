import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useFavoritesStore = defineStore("favorites", () => {
  const names = useLocalStorage<string[]>("name-shuffle-favorites", []);

  function remove(name: string) {
    names.value = names.value.filter((item) => item !== name);
  }

  function toggle(name: string) {
    if (names.value.includes(name)) remove(name);
    else names.value.push(name);
  }

  return { names, remove, toggle };
});
