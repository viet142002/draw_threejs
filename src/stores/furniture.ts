import { create } from "zustand";
import { IFurniture, IAddingFurniture } from "../types";

interface IFurnitureStore {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;

  addingFurniture: IAddingFurniture| null;
  setAddingFurniture: (furniture: IAddingFurniture| null) => void;

  activeFurniture: IFurniture | null;
  setActiveFurniture: (furniture: string | null) => void;

  furnitureList: IFurniture[];
  addFurniture: (furniture: IFurniture) => void;
  updateFurniture: ({ id, data }: { id: string; data: Partial<IFurniture> }) => void;
  updateArrayFurniture: (items: Array<{ id: string, data: Partial<IFurniture> }>) => void;
}

const useFurniture = create<IFurnitureStore>((set) => ({
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  
  addingFurniture: null,
  setAddingFurniture: (furniture) => set({ addingFurniture: furniture }),

  activeFurniture: null,
  setActiveFurniture: (furnitureId) => set((state) => ({
    activeFurniture: state.furnitureList.find((furniture) => furniture.id === furnitureId) || null,
  })),

  furnitureList: [],
  addFurniture: (furniture) =>
    set((state) => ({ furnitureList: [...state.furnitureList, furniture] })),
  updateFurniture: ({ id, data }) =>
    set((state) => ({
      furnitureList: state.furnitureList.map((furniture) =>
        furniture.id === id ? { ...furniture, ...data } : furniture,
      ),
    })),
  updateArrayFurniture: (items) => set((state) => {
    items.forEach(({ id, data }) => {
      state.furnitureList.forEach((furniture) => {
        if (furniture.id === id) {
          Object.assign(furniture, data);
        }
      });
    });
    return ({ furnitureList: state.furnitureList });
  }),
}));

export default useFurniture;
