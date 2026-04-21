import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  TrialFilters,
  TrialPhase,
  TrialStatus,
  InterventionType,
  DEFAULT_FILTERS,
} from "@/lib/types/trials";

// ──────────────────────────────────────────────
// Trial Store — filters, favorites, UI state
// ──────────────────────────────────────────────

interface TrialStoreState {
  /** Current search query */
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  /** Active filters */
  filters: TrialFilters;
  setPhases: (phases: TrialPhase[]) => void;
  setStatuses: (statuses: TrialStatus[]) => void;
  setInterventionTypes: (types: InterventionType[]) => void;
  setSortBy: (sortBy: TrialFilters["sortBy"]) => void;
  setSortOrder: (sortOrder: TrialFilters["sortOrder"]) => void;
  resetFilters: () => void;
  togglePhase: (phase: TrialPhase) => void;
  toggleStatus: (status: TrialStatus) => void;
  toggleInterventionType: (type: InterventionType) => void;

  /** Favorited trial NCT IDs */
  favorites: string[];
  toggleFavorite: (nctId: string) => void;
  isFavorite: (nctId: string) => boolean;

  /** Compare list (max 3) */
  compareList: string[];
  addToCompare: (nctId: string) => void;
  removeFromCompare: (nctId: string) => void;
  clearCompare: () => void;
  isInCompare: (nctId: string) => boolean;

  /** UI state */
  isFilterPanelOpen: boolean;
  setFilterPanelOpen: (open: boolean) => void;
}

export const useTrialStore = create<TrialStoreState>()(
  persist(
    (set, get) => ({
      // Search
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Filters
      filters: { ...DEFAULT_FILTERS },
      setPhases: (phases) =>
        set((s) => ({ filters: { ...s.filters, phases } })),
      setStatuses: (statuses) =>
        set((s) => ({ filters: { ...s.filters, statuses } })),
      setInterventionTypes: (interventionTypes) =>
        set((s) => ({ filters: { ...s.filters, interventionTypes } })),
      setSortBy: (sortBy) =>
        set((s) => ({ filters: { ...s.filters, sortBy } })),
      setSortOrder: (sortOrder) =>
        set((s) => ({ filters: { ...s.filters, sortOrder } })),
      resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

      togglePhase: (phase) =>
        set((s) => {
          const current = s.filters.phases;
          const next = current.includes(phase)
            ? current.filter((p) => p !== phase)
            : [...current, phase];
          return { filters: { ...s.filters, phases: next } };
        }),

      toggleStatus: (status) =>
        set((s) => {
          const current = s.filters.statuses;
          const next = current.includes(status)
            ? current.filter((st) => st !== status)
            : [...current, status];
          return { filters: { ...s.filters, statuses: next } };
        }),

      toggleInterventionType: (type) =>
        set((s) => {
          const current = s.filters.interventionTypes;
          const next = current.includes(type)
            ? current.filter((t) => t !== type)
            : [...current, type];
          return { filters: { ...s.filters, interventionTypes: next } };
        }),

      // Favorites
      favorites: [],
      toggleFavorite: (nctId) =>
        set((s) => {
          const next = s.favorites.includes(nctId)
            ? s.favorites.filter((id) => id !== nctId)
            : [...s.favorites, nctId];
          return { favorites: next };
        }),
      isFavorite: (nctId) => get().favorites.includes(nctId),

      // Compare
      compareList: [],
      addToCompare: (nctId) =>
        set((s) => {
          if (s.compareList.includes(nctId) || s.compareList.length >= 3)
            return s;
          return { compareList: [...s.compareList, nctId] };
        }),
      removeFromCompare: (nctId) =>
        set((s) => ({
          compareList: s.compareList.filter((id) => id !== nctId),
        })),
      clearCompare: () => set({ compareList: [] }),
      isInCompare: (nctId) => get().compareList.includes(nctId),

      // UI
      isFilterPanelOpen: false,
      setFilterPanelOpen: (open) => set({ isFilterPanelOpen: open }),
    }),
    {
      name: "clinical-trial-tracker",
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);
