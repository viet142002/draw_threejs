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
    snap: {
      snapStart: string | null;
      snapEnd: string | null;
    };
    needRevertDirect: boolean;
  }
  setWallDrawPoints: (points: {
    start: Vector3 | null;
    end: Vector3 | null,
    snap?: {
      snapStart: string | null;
      snapEnd: string | null;
    }
  }, needRevertDirect?: boolean) => void;

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
    snap: { snapStart: null, snapEnd: null },
    needRevertDirect: false,
  },
  setWallDrawPoints: (points, needRevertDirect) => set(state => ({
    wallDrawPoints: {
      ...points,
      snap: {
        snapStart: points.snap?.snapStart ?? state.wallDrawPoints.snap.snapStart,
        snapEnd: points.snap?.snapEnd ?? state.wallDrawPoints.snap.snapEnd
      },
      needRevertDirect: needRevertDirect ?? state.wallDrawPoints.needRevertDirect
    }
  })),

  walls: [],
  addWall: (wall) => {
    set((state) => {
      const matrix = generateMatrixWallFromLength([wall.start, wall.end], wall.height, SIZE_BRICK);
      if (wall.snap.snapStart) {
        const snapWall = state.walls.find(w => w.id === wall.snap.snapStart);
        if (snapWall) {
          snapWall.snap.snapEnd = wall.id;
        }
      }
      if (wall.snap.snapEnd) {
        const snapWall = state.walls.find(w => w.id === wall.snap.snapEnd);
        if (snapWall) {
          snapWall.snap.snapStart = wall.id;
        }
      }
      return ({
        walls: [...state.walls, { ...wall, matrix }],
        wallDrawPoints: { start: null, end: null, snap: { snapStart: null, snapEnd: null }, needRevertDirect: false },
      })
    });
  },

  resetStore: () => set({
    isDrawWall: false,
    wallDrawPoints: { start: null, end: null, snap: { snapStart: null, snapEnd: null }, needRevertDirect: false },
    isDrawDoor: false,
    isDrawWindow: false
  }),
}));