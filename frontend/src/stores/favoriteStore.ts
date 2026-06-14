import { create } from 'zustand';
import { readLocalStorage, writeLocalStorage } from '../hooks/useLocalStorage';

const STORAGE_KEY = 'wje-133-favorites';

interface FavoriteState {
  favoriteIds: Set<string>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

function loadFavorites(): Set<string> {
  const arr = readLocalStorage<string[]>(STORAGE_KEY, []);
  return new Set(arr);
}

function saveFavorites(ids: Set<string>) {
  writeLocalStorage(STORAGE_KEY, Array.from(ids));
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favoriteIds: loadFavorites(),
  toggleFavorite: (id) =>
    set((state) => {
      const next = new Set(state.favoriteIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveFavorites(next);
      return { favoriteIds: next };
    }),
  isFavorite: (id) => get().favoriteIds.has(id)
}));
