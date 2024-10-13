import { create } from "zustand";

type Window = {
  type: 'window';
  id: string;
  height: number;
  width: number;
  depth: number;
}

type Wall = {
  type: 'wall';
  id: string;
  height: number;
}

type ISelected = Window | Wall;

interface ISelectStore {
  selected: ISelected | null;
  setSelected: (selected: ISelected | null) => void;
}

export const useSelectStore = create<ISelectStore>((set) => ({
  selected: null,
  setSelected: (selected) => set({ selected }),
}));