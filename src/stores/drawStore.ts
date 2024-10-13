import { create } from "zustand";
import { TypeDraw } from "../types";

interface DrawStore {
    isDrawWall: boolean;
    isDrawDoor: boolean;
    isDrawWindow: boolean;
    setDraw: (drawType: TypeDraw | null) => void;
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
            case null:
                set({ isDrawWall: false, isDrawDoor: false, isDrawWindow: false });
                break;
            default:
                break;
        }
    },
}));
