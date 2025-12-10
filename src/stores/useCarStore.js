import { create } from 'zustand'

export const useCarStore = create((set) => ({
  rpm: 0,
  setRpm: (rpm) => set({ rpm })
}))