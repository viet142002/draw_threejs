import { Vector3 } from "three";

export const SIZE_BRICK = {
  width: 0.625,
  height: 0.05,
  depth: 0.1,
}

export const SIZE_CORNER = {
  width: 0.117,
  height: 0.1,
  depth: 0.05,
}

export const HEIGHT_WALL = 2;

// Space to snap wall
export const SPACE = 0.015;

export const DELTA_SNAP_START = new Vector3(-SIZE_BRICK.depth / 4, 0, -SIZE_BRICK.depth / 4);
export const DELTA_SNAP_END = new Vector3(SIZE_BRICK.depth / 4, 0, SIZE_BRICK.depth / 4);