import { create } from "zustand";
import { ICeil, IWall, TypeDraw } from "../types";
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
  addWall: (wall: Omit<IWall, 'numberOfBrick' | 'remainingLength' | 'direction'>) => void;
  updateWall: (id: string, data: Partial<IWall>) => void;
  removeWall: (id: string) => void;

  ceils: Array<ICeil>;
  createCeil: (points: Array<Vector3>) => void;
  addPointToCeil: (id: string, point: Vector3) => void;

  resetStore: () => void;
}

const initWallDrawPoints = {
  start: null,
  end: null,
  snap: { snapStart: null, snapEnd: null },
  needRevertDirect: false,
  ceil: null
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

  wallDrawPoints: initWallDrawPoints,
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
      let newCeil: ICeil | null = null;
      const { matrices: matrix, numberOfBrick, remainingLength, direction } = generateMatrixWallFromLength([wall.start, wall.end], wall.height, SIZE_BRICK);

      if (wall.snap.snapStart) {
        const snapWall = state.walls.find(w => w.id === wall.snap.snapStart);
        if (snapWall) {
          snapWall.snap.snapEnd = wall.id;
          wall.ceil = snapWall.ceil;
          const ceil = state.ceils.find(c => c.id === snapWall.ceil);
          if (ceil) {
            ceil.points.push(wall.end.clone().add(new Vector3(0, wall.height, 0)));
          }
        }
      }
      if (wall.snap.snapEnd) {
        const snapWall = state.walls.find(w => w.id === wall.snap.snapEnd);
        if (snapWall) {
          snapWall.snap.snapStart = wall.id;
          wall.ceil = snapWall.ceil;
          const ceil = state.ceils.find(c => c.id === snapWall.ceil);
          if (ceil) {
            ceil.points = [wall.start.clone().add(new Vector3(0, wall.height, 0)), ...ceil.points];
          }
        }
      }


      if (!wall.ceil) {
        newCeil = {
          id: `ceil-${new Date().getTime()}`,
          points: [
            wall.start.clone().add(new Vector3(0, wall.height, 0)),
            wall.end.clone().add(new Vector3(0, wall.height, 0))
          ]
        };
        wall.ceil = newCeil.id;
      }

      return ({
        walls: [...state.walls, { ...wall, matrix, numberOfBrick, remainingLength, direction }],
        wallDrawPoints: initWallDrawPoints,
        ceils: newCeil ? [...state.ceils, newCeil] : [...state.ceils],
      })
    });
  },
  updateWall: (id, data) => {
    set((state) => {
      const wall = state.walls.find(w => w.id === id);
      if (wall) {
        Object.assign(wall, data);
        if (data.height) {
          const { matrices } = generateMatrixWallFromLength([wall.start, wall.end], wall.height, SIZE_BRICK);
          wall.matrix = matrices;
        }
      }
      return ({
        walls: [...state.walls],
      })
    });
  },
  removeWall: (id) => {
    set((state) => {
      const wall = state.walls.find(w => w.id === id);
      if (wall) {
        if (wall.snap.snapStart) {
          const snapWall = state.walls.find(w => w.id === wall.snap.snapStart);
          if (snapWall) {
            snapWall.snap.snapEnd = null;
            const ceil = state.ceils.find(c => c.id === snapWall.ceil);
            if (ceil) {
              ceil.points = ceil.points.filter(p => p !== wall.start);
            }
          }
        }
        if (wall.snap.snapEnd) {
          const snapWall = state.walls.find(w => w.id === wall.snap.snapEnd);
          if (snapWall) {
            snapWall.snap.snapStart = null;
            const ceil = state.ceils.find(c => c.id === snapWall.ceil);
            if (ceil) {
              ceil.points = ceil.points.filter(p => p !== wall.end);
            }
          }
        }
      }
      return ({
        walls: state.walls.filter(w => w.id !== id),
        ceils: state.ceils.filter(c => c.id !== wall?.ceil)
      })
    });
  },

  ceils: [],
  createCeil: (points) => {
    set((state) => {
      const id = `ceil-${state.ceils.length + 1}`;
      return ({
        ceils: [...state.ceils, { id, points }],
      })
    });
  },
  addPointToCeil: (id, point) => {
    set((state) => {
      const ceil = state.ceils.find(c => c.id === id);
      if (ceil) {
        ceil.points.push(point);
      }
      return ({
        ceils: [...state.ceils],
      })
    });
  },

  resetStore: () => set({
    isDrawWall: false,
    wallDrawPoints: initWallDrawPoints,
    isDrawDoor: false,
    isDrawWindow: false
  }),
}));