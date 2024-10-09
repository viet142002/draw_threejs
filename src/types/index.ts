import { Matrix4, Vector3 } from "three";
export * from './util';
export type TypeDraw = 'wall' | 'door' | 'window';

export type Point3 = [number, number, number] | Vector3;

export interface IWall {
  id: string;
  start: Vector3;
  end: Vector3;
  height: number;
  numberOfBrick: number;
  remainingLength: number;
  direction: Vector3;
  snap: {
    snapStart: string | null;
    snapEnd: string | null;
  };
  matrix?: Matrix4[];
  ceil: string | null;
}

export interface ISnap {
  snapStart: IWall | null;
  snapEnd: IWall | null;
}

export interface ISnapString {
  snapStart: string | null;
  snapEnd: string | null;
}

export interface ICeil {
  id: string;
  // points: Array<Vector3>;
  // walls: Array<Pick<IWall, 'snap' | 'id' | 'end' | 'start' | 'height'>>;
  // height: Array<number>;
  wallIds: Array<string>;
}

export interface IDim {
  id: string;
  wallId: string;
  start: Vector3;
  end: Vector3;
  distance: number;
}