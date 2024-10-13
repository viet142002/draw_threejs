import { Vector3 } from "three";
import { create } from "zustand";
import { ISnap } from "../types";

interface DrawPointStore {
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
    resetWallDrawPoints: () => void;
}

export const useDrawPointStore = create<DrawPointStore>((set, get) => ({
    wallDrawPoints: {
        start: null,
        end: null,
        snap: { snapStart: null, snapEnd: null },
        needRevertDirect: false,
    },
    setWallDrawPoints: (points, needRevertDirect) => {
        set({
            wallDrawPoints: {
                ...get().wallDrawPoints,
                ...points,
                needRevertDirect: needRevertDirect ?? get().wallDrawPoints.needRevertDirect,
            }
        })
    },
    resetWallDrawPoints: () => {
        set({
            wallDrawPoints: {
                start: null,
                end: null,
                snap: { snapStart: null, snapEnd: null },
                needRevertDirect: false,
            }
        })
    }
}))