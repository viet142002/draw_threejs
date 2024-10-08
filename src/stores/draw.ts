import { create } from "zustand";
import { ICeil, IDim, ISnap, IWall, TypeDraw } from "../types";
import { Vector3 } from "three";
import { SIZE_BRICK, HEIGHT_WALL } from "../constants";
import { generateMatrixWallFromLength } from "../utils";

interface DrawStore {
  isDrawWall: boolean;
  isDrawDoor: boolean;
  isDrawWindow: boolean;
  setDraw: (drawType: TypeDraw) => void;

  wallDrawPoints: {
    start: Vector3 | null;
    end: Vector3 | null;
    snap: ISnap;
    needRevertDirect: boolean;
  }
  setWallDrawPoints: (points: {
    start: Vector3 | null;
    end: Vector3 | null,
    snap?: ISnap,
  }, needRevertDirect?: boolean) => void;

  walls: Array<IWall>
  addWall: (wall: Omit<IWall, 'numberOfBrick' | 'remainingLength' | 'direction'>) => void;
  updateWall: (id: string, data: Partial<IWall>) => void;
  removeWall: (id: string) => void;

  ceils: Array<ICeil>;
  createCeil: (points: Array<Vector3>) => void;
  addPointToCeil: (id: string, point: Vector3) => void;

  dims: Array<IDim>;
  addDim: (dim: IDim) => void;
  removeDimByWallId: (id: string) => void;
  updateDim: (id: string, data: Partial<IDim>) => void

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
            ceil.height = [...ceil.height, wall.height];
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
            ceil.height = [wall.height, ...ceil.height];
          }
        }
      }

      if (!wall.ceil) {
        newCeil = {
          id: `ceil-${new Date().getTime()}`,
          points: [
            wall.start.clone().add(new Vector3(0, 0, 0)),
            wall.end.clone().add(new Vector3(0, 0, 0))
          ],
          height: [wall.height]
        };
        wall.ceil = newCeil.id;
      }

      return ({
        walls: [...state.walls, { ...wall, matrix, numberOfBrick, remainingLength, direction }],
        wallDrawPoints: initWallDrawPoints,
        ceils: newCeil ? [...state.ceils, newCeil] : [...state.ceils],
      });
    });
  },
  updateWall: (id, data) => {
    set((state) => {
      const wall = state.walls.find(w => w.id === id);
      let isChangeCeilHeight = false;
      if (wall) {
        const oldHeight = wall.height;
        Object.assign(wall, data);
        if (data.height) {
          const { matrices } = generateMatrixWallFromLength([wall.start, wall.end], wall.height, SIZE_BRICK);
          wall.matrix = matrices;
          const ceil = state.ceils.find(c => c.id === wall.ceil);
          if (ceil) {
            const index = ceil.height.findIndex(h => h === oldHeight);
            if (index === -1) {
              ceil.height.push(wall.height);
            } else {
              ceil.height[index] = wall.height;
            }
            isChangeCeilHeight = true;
          }
        }
      }
      return ({
        walls: [...state.walls],
        ceils: isChangeCeilHeight ? [...state.ceils] : state.ceils
      });
    });
  },
  // TODO: Fix when remove wall, remove ceil then ceil not display
  removeWall: (id) => {
    set((state) => {
      const wall = state.walls.find(w => w.id === id);
      if (wall) {
        state.removeDimByWallId(wall.id);
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
      });
    });
  },

  ceils: [],
  createCeil: (points) => {
    set((state) => {
      const id = `ceil-${state.ceils.length + 1}`;
      return ({
        ceils: [...state.ceils, { id, points, height: [HEIGHT_WALL] }],
      });
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
      });
    });
  },

  dims: [],
  addDim: (dim) => set((state) => ({
    dims: [...state.dims, dim]
  })),
  removeDimByWallId: (id) => set(state => {
    return {
      dims: state.dims.filter(d => d.wallId !== id)
    };
  }),
  updateDim: (id, data) => set(state => {
    const dim = state.dims.find(d => d.id === id);
    if (!dim) return state;
    Object.assign(dim, data);
    return {
      dims: [...state.dims]
    };
  }),

  resetStore: () => set({
    isDrawWall: false,
    wallDrawPoints: initWallDrawPoints,
    isDrawDoor: false,
    isDrawWindow: false
  }),
}));