import { create } from "zustand";
import { TypeDraw } from "../types";

interface ISelected {
  type: TypeDraw;
  id: string;
  height: number
}

interface ISelectStore {
  selected: ISelected | null;
  setSelected: (selected: ISelected | null) => void;
}

export const useSelectStore = create<ISelectStore>((set) => ({
  selected: null,
  setSelected: (selected) => set({ selected }),
}));