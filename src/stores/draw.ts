import { create } from "zustand";
import { ICeil, IDim, ISnap, IWall, TypeDraw } from "../types";
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
  createCeil: (ceil: ICeil) => void;
  addWallBeginToCei: (ceilId: string, wallId: string) => void;
  addWallFinalToCei: (ceilId: string, wallId: string) => void;
  addWallBetweenToCei: (ceilId: string, wallId: string, startId: string, ceilNeedRemove: string) => void;
  removeCeilByWallId: (wallId: string, ceilId: string) => void;

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
      const { matrices: matrix, numberOfBrick, remainingLength, direction } = generateMatrixWallFromLength([wall.start, wall.end], wall.height, SIZE_BRICK);
      if (wall.snap.snapStart && !wall.snap.snapEnd) {
        const snapWall = state.walls.find(w => w.id === wall.snap.snapStart);
        if (snapWall) {
          snapWall.snap.snapEnd = wall.id;
          wall.ceil = snapWall.ceil;
          if (wall.ceil) {
            state.addWallFinalToCei(wall.ceil, wall.id)
          }
        }
      }
      if (wall.snap.snapEnd && !wall.snap.snapStart) {
        const snapWall = state.walls.find(w => w.id === wall.snap.snapEnd);
        if (snapWall) {
          snapWall.snap.snapStart = wall.id;
          wall.ceil = snapWall.ceil;
          if (wall.ceil) {
            state.addWallBeginToCei(wall.ceil, wall.id)
          }
        }
      }
      if (wall.snap.snapStart && wall.snap.snapEnd) {
        const snapWallStart = state.walls.find(w => w.id === wall.snap.snapStart);
        const snapWallEnd = state.walls.find(w => w.id === wall.snap.snapEnd);
        if (snapWallStart && snapWallEnd) {
          snapWallStart.snap.snapEnd = wall.id;
          snapWallEnd.snap.snapStart = wall.id;
          const ceilId = snapWallStart.ceil;
          wall.ceil = ceilId;
          if (ceilId && snapWallStart.ceil !== snapWallEnd.ceil && snapWallEnd.ceil) {
            state.addWallBetweenToCei(ceilId, wall.id, snapWallStart.id, snapWallEnd.ceil)
          }
        }
      }
      if (!wall.ceil) {
        const newCeil = {
          id: `ceil-${new Date().getTime()}`,
          wallIds: [wall.id],
        };
        wall.ceil = newCeil.id;
        state.createCeil(newCeil)
      }
      return ({
        walls: [...state.walls, { ...wall, matrix, numberOfBrick, remainingLength, direction }],
        wallDrawPoints: initWallDrawPoints,
      });
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
      });
    });
  },
  removeWall: (id) => {
    set((state) => {
      const wall = state.walls.find(w => w.id === id);
      if (wall) {
        state.removeDimByWallId(wall.id);
        // if (wall?.ceil) state.removeCeilByWallId(wall.id, wall.ceil)
        if (wall.snap.snapStart) {
          const snapWall = state.walls.find(w => w.id === wall.snap.snapStart);
          if (snapWall) {
            snapWall.snap.snapEnd = null;
          }
        }
        if (wall.snap.snapEnd) {
          const snapWall = state.walls.find(w => w.id === wall.snap.snapEnd);
          if (snapWall) {
            snapWall.snap.snapStart = null;
          }
        }
        if (wall.ceil) {
          const ceil = state.ceils.find(c => c.id === wall.ceil);
          if (ceil) {
            const index = ceil.wallIds.indexOf(wall.id);
            if (index > -1 && index < ceil.wallIds.length - 1) {
              const wallRight = ceil.wallIds.slice(index + 1);
              ceil.wallIds = ceil.wallIds.slice(0, index);
              const newCeilId = `ceil-${Date.now()}`;
              const newCeil = { id: newCeilId, wallIds: wallRight };
              state.createCeil(newCeil);
              wallRight.forEach(wId => {
                const wall = state.walls.find(wa => wa.id === wId);
                if (wall) wall.ceil = newCeilId;
              });
            }
          }
        }

      }
      return ({
        walls: state.walls.filter(w => w.id !== id),
      });
    });
  },

  ceils: [],
  removeCeilByWallId: (wallId, ceilId) => set(state => {
    const ceil = state.ceils.find(c => c.id === ceilId);
    if (!ceil) {
      return state;
    }
    ceil.wallIds = ceil.wallIds.filter(id => id !== wallId)
    return {
      ceils: [...state.ceils]
    }
  }),
  createCeil: (ceil) => set(state => {
    return {
      ceils: [...state.ceils, ceil]
    }
  }),
  addWallBeginToCei: (ceilId, wallId) => set(state => {
    const ceil = state.ceils.find(c => c.id === ceilId);
    if (!ceil) {
      return state;
    }
    ceil.wallIds = [wallId, ...ceil.wallIds];
    console.log("add to begin: ", wallId, ceil.wallIds);
    return {
      ceils: [...state.ceils]
    }
  }),
  addWallFinalToCei: (ceilId, wallId) => set(state => {
    const ceil = state.ceils.find(c => c.id === ceilId);
    if (!ceil) {
      return state;
    }
    ceil.wallIds.push(wallId);
    return {
      ceils: [...state.ceils]
    }
  }),
  addWallBetweenToCei: (ceilId, wallId, startId, ceilNeedRemove) => set(state => {
    const ceilRemove = state.ceils.find(c => c.id === ceilNeedRemove);
    state.ceils = state.ceils.filter(c => c.id !== ceilNeedRemove);
    const ceil = state.ceils.find(c => c.id === ceilId);
    if (!ceil) {
      return state;
    }
    const index = ceil.wallIds.indexOf(startId);
    if (index > -1) {
      ceil.wallIds.splice(index + 1, 0, wallId);
      if (ceilRemove) {
        ceil.wallIds = [...ceil.wallIds, ...ceilRemove.wallIds];
      }
    }
    return {
      ceils: [...state.ceils]
    }
  }),

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