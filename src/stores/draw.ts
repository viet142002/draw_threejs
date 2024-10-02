import { create } from "zustand";
import { IWall, TypeDraw } from "../types";
import { Vector3 } from "three";
import { SIZE_BRICK } from "../constants";
import { generateMatrixWallFromLength } from "../utils";

interface DrawStore {
  isDrawWall: boolean;
  isDrawDoor: boolean;
  isDrawWindow: boolean;
  setDraw: (drawType: TypeDraw) => void;

  wallDrawPoints: {
    start: Vector3 | null;
    end: Vector3 | null;
  }
  setWallDrawPoints: (points: { start: Vector3 | null; end: Vector3 | null }) => void;

  walls: Array<IWall>
  addWall: (wall: IWall) => void;

  resetStore: () => void;
}

export const useDrawStore = create<DrawStore>((set) => ({
  isDrawWall: false,
  isDrawDoor: false,
  isDrawWindow: false,
  setDraw: (drawType) => {
    switch (drawType) {
      case 'wall':
        set({ isDrawWall: true, isDrawDoor: false, isDrawWindow: false });
        break;
      case 'door':
        set({ isDrawWall: false, isDrawDoor: true, isDrawWindow: false });
        break;
      case 'window':
        set({ isDrawWall: false, isDrawDoor: false, isDrawWindow: true });
        break;
      default:
        break;
    }
  },

  wallDrawPoints: {
    start: null,
    end: null,
  },
  setWallDrawPoints: (points) => set({ wallDrawPoints: points }),

  walls: [],
  addWall: (wall: IWall) => {
    const matrix = generateMatrixWallFromLength([wall.start, wall.end], wall.height, SIZE_BRICK);
    set((state) => ({ 
      walls: [...state.walls, { ...wall, matrix}], 
      wallDrawPoints: { start: null, end: null }, 
    }));
  },

  resetStore: () => set({ 
    isDrawWall: false, 
    wallDrawPoints: { start: null, end: null }, 
    isDrawDoor: false, 
    isDrawWindow: false 
  }),
}));