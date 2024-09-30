import { OrbitControlsProps } from "@react-three/drei";
import { create } from "zustand";

interface OrbitControlStore {
  options: OrbitControlsProps;
  setOptionsControl: (options: OrbitControlsProps) => void;
}

const useOrbitControl = create<OrbitControlStore>((set) => ({
  options: {},
  setOptionsControl: (options: OrbitControlsProps) =>
    set((state) => ({ ...state, options })),
}));

export default useOrbitControl;
