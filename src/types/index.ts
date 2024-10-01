import { Matrix4, Vector3 } from "three";

export type TypeDraw = 'wall' | 'door' | 'window';

export type Point3 = [number, number, number] | Vector3;

export interface IWall {
  start: Vector3;
  end: Vector3;
  snapStart?: string;
  snapEnd?: string;
  matrix?: Matrix4[][];
}