import { create } from "zustand";

interface PointerState {
  x: number;
  y: number;
  setPointer: (x: number, y: number) => void;
}

const usePointerStore = create<PointerState>((set) => ({
  x: 0,
  y: 0,
  setPointer: (x: number, y: number) => set({ x, y }),
}));

export default usePointerStore;
