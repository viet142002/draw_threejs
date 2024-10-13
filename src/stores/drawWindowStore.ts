import { create } from "zustand";
import { IWindow } from "../types";

interface drawWindowStore {
    windows: Array<IWindow>;
    addWindow: (window: IWindow) => void;
    removeWindow: (id: string) => void;
    updateWindow: (id: string, data: Partial<IWindow>) => void;
    unableUpdate: (id: string) => void;
}

export const useDrawWindowStore = create<drawWindowStore>((set) => ({
    windows: [],
    addWindow: (window) => set(state => ({
        windows: [...state.windows, window]
    })),
    removeWindow: (id) => set(state => ({
        windows: state.windows.filter(w => w.id !== id)
    })),
    updateWindow: (id, data) => set(state => {
        const window = state.windows.find(w => w.id === id);
        if (!window) return state;
        Object.assign(window, data);
        return {
            windows: [...state.windows]
        };
    }),
    unableUpdate: (id) => set(state => {
        const window = state.windows.find(w => w.id === id);
        if (!window) return state;
        window.needUpdate = false;
        return state;
    })
}));
