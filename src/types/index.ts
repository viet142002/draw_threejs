import { Matrix4, Vector3 } from "three";

export type TypeDraw = 'wall' | 'door' | 'window';

export type Point3 = [number, number, number] | Vector3;

export interface IWall {
  id: string;
  start: Vector3;
  end: Vector3;
  height: number;
  snap: {
    snapStart: string | null;
    snapEnd: string | null;
  };
  direction?: Vector3;
  matrix?: Matrix4[];
}

export interface ISnap {
  snapStart: IWall | null;
  snapEnd: IWall | null;
}