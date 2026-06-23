import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  ironmanMode: boolean
  setIronmanMode: (value: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ironmanMode: false,
      setIronmanMode: (value) => set({ ironmanMode: value }),
    }),
    { name: 'idle-clanner-settings' },
  ),
)
