import { Matrix4 } from "three";

type TypeDirection = 'start-left' | 'start-right' | 'end-left' | 'end-right';

/**
 * Default corner have a direction (>) to the right (Ox) and (<) to the bottom (Oz) 
 * @param direction: 'left' | 'right' | 'up' | 'down'
 * @returns matrix4
  */
export const rotateCorner = (direction: TypeDirection) => {
  const m = new Matrix4();
  if (direction === 'start-left') {
    m.makeRotationY(-Math.PI / 2);
  }
  // complete
  if (direction === 'start-right') {
    m.makeRotationY(Math.PI / 2);
  }
  if (direction === 'end-left') {
    m.makeRotationY(Math.PI);
  }
  if (direction === 'end-right') {
    m.makeRotationY(0);
  }
  return m;
}