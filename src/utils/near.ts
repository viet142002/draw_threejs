import { Matrix4, Vector3 } from "three";
import { IFurniture } from "../types";
import { getPositionCenterAside } from "./position";

const DISTANCE = 1;
const MIN_ANGLE = Math.PI / 2;
const MAX_ANGLE = Math.PI;

export function findNearFurniture(
  activeFurniture: IFurniture,
  position: Vector3,
  furnitureList: IFurniture[],
) {
  if (!activeFurniture.size) return null;
  const { center: activeCenter, aside: activeAside } = getCenterFromMatrix(
    activeFurniture.matrix, activeFurniture.size, position);
  const {
    vectorBefore: activeVectorBefore,
    vectorAfter: activeVectorAfter,
    vectorLeft: activeVectorLeft,
    vectorRight: activeVectorRight,
  } = getVectors(activeCenter, activeAside);
  let isBefore = false;
  let isAfter = false;
  let isLeft = false;
  let isRight = false;
  let needRotate = 0;


  const nearFurniture = furnitureList.find((furniture) => {
    if (furniture.id === activeFurniture.id || !furniture?.size) return false;
    const { center ,aside } = getCenterFromMatrix(furniture.matrix, furniture.size);
    const {
      vectorBefore,
      vectorAfter,
      vectorLeft,
      vectorRight,
    } = getVectors(center, aside);
    if (furniture.direction === "Oz") {
      const isNearBefore = activeAside.before.distanceTo(aside.after) <= DISTANCE;
      const isNearAfter = activeAside.after.distanceTo(aside.before) <= DISTANCE;
      let angle = 0;
      if (isNearBefore) {
        isBefore = true;
        angle = activeVectorBefore.angleTo(vectorAfter);
      }
      if (isNearAfter) {
        isAfter = true;
        angle = activeVectorAfter.angleTo(vectorBefore);
      }
      if (angle < MIN_ANGLE || angle > MAX_ANGLE) {
        return false;
      }
      needRotate = Math.floor(Math.PI - angle); 
      return (
        (isNearBefore && !furniture.filled.after) ||
        (isNearAfter && !furniture.filled.before)
      );
    }
    if (furniture.direction === "Ox") {
      const isNearLeft = activeAside.left.distanceTo(aside.right) <= DISTANCE;
      const isNearRight = activeAside.right.distanceTo(aside.left) <= DISTANCE;
      let angle = 0;
      if (isNearLeft) {
        isLeft = true;
        angle = activeVectorLeft.angleTo(vectorRight);
      };
      if (isNearRight) {
        isRight = true;
        angle = activeVectorRight.angleTo(vectorLeft);
      }
      if (angle < MIN_ANGLE || angle > MAX_ANGLE) {
        return false;
      }
      needRotate = Math.PI - angle;
      return (
        (isNearLeft && !furniture.filled.right) ||
        (isNearRight && !furniture.filled.left)
      );
    }
    return false;
  });

  return {
    furniture: nearFurniture,
    isBefore,
    isAfter,
    isLeft,
    isRight,
    needRotate,
  };
}

export function findAllNearFurniture(
  activeFurniture: IFurniture,
  position: Vector3,
  furnitureList: IFurniture[],
) {
  if (!activeFurniture.size) return [];
  const { center: activeCenter, aside: activeAside } = getCenterFromMatrix(
    activeFurniture.matrix, activeFurniture.size, position);
  const {
    vectorBefore: activeVectorBefore,
    vectorAfter: activeVectorAfter,
    vectorLeft: activeVectorLeft,
    vectorRight: activeVectorRight,
  } = getVectors(activeCenter, activeAside);

  return furnitureList.reduce((acc, furniture) => {
    if (furniture.id === activeFurniture.id || !furniture?.size) return acc;
    const { center, aside } = getCenterFromMatrix(furniture.matrix, furniture.size);
    const {
      vectorBefore,
      vectorAfter,
      vectorLeft,
      vectorRight,
    } = getVectors(center, aside);

    let directions = [];

    if (activeFurniture.direction === 'Oz') {
      directions = [
        { name: 'before', activeSide: activeAside.before, targetSide: aside.after, activeVector: activeVectorBefore, targetVector: vectorAfter },
        { name: 'after', activeSide: activeAside.after, targetSide: aside.before, activeVector: activeVectorAfter, targetVector: vectorBefore },
      ];
    } else {
      directions = [
        { name: 'left', activeSide: activeAside.left, targetSide: aside.right, activeVector: activeVectorLeft, targetVector: vectorRight },
        { name: 'right', activeSide: activeAside.right, targetSide: aside.left, activeVector: activeVectorRight, targetVector: vectorLeft },
      ];
    }

    directions.forEach(dir => {
      if (dir.activeSide.distanceTo(dir.targetSide) <= DISTANCE) {
        const angle = dir.activeVector.angleTo(dir.targetVector);

        if (furniture.filled[dir.name as keyof IFurniture['filled']]) return;

        if (angle >= MIN_ANGLE && angle <= MAX_ANGLE) {
          acc.push({
            furniture,
            direction: dir.name as keyof IFurniture['filled'],
            needRotate: Math.PI - angle,
          });
        }
      }
    });

    return acc;
  }, [] as Array<{
    furniture: IFurniture,
    direction: 'before' | 'after' | 'left' | 'right',
    needRotate: number
  }>);
}

export function getCenterFromMatrix(matrix: Matrix4, size: Vector3, p?: Vector3) {
  return {
    center: p ?? new Vector3().applyMatrix4(matrix),
    aside: getPositionCenterAside(new Vector3().applyMatrix4(matrix), size),
  };
}

function getVectors(center: Vector3, aside: { before: Vector3; after: Vector3; left: Vector3; right: Vector3 }) {
  return {
    vectorBefore: center.clone().sub(aside.before),
    vectorAfter: center.clone().sub(aside.after),
    vectorLeft: center.clone().sub(aside.left),
    vectorRight: center.clone().sub(aside.right),
  }
}

export function getDirectValue(value: string) {
  switch (value) {
    case "before":
      return "after";
    case "after":
      return "before";
    case "left":
      return "right";
    case "right":
      return "left";
    default:
      return "";
  }
};

// { before: string | null, after: string | null, left: string | null, right: string | null }
export function getFieldFromId(id: string, data: { before: string | null, after: string | null, left: string | null, right: string | null }) {
  if (data.before === id) return "before";
  if (data.after === id) return "after";
  if (data.left === id) return "left";
  if (data.right === id) return "right";
  return "";
}