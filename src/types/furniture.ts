import { Matrix4, Vector3 } from "three";

export interface IFurniture {
  id: string;
  name: FurnitureType;
  matrix: Matrix4;
  modelUrl: string;
  userData: IUserData;
  direction: "Oz" | "Ox";
  size?: Vector3;
  filled: {
    before: string | null;
    after: string | null;
    left: string | null;
    right: string | null;
  }
}

export type IAddingFurniture = Omit<IFurniture, "matrix">;

export type FurnitureType =
  | "chair"
  | "table"
  | "pantry-1"
  | "pantry-2"
  | "pantry-3";

export interface IUserData {
  draggable: boolean;
  id: string;
  name: FurnitureType;
}
