import { Vector3 } from "three";
import { IFurniture } from "../types";

export function getPositionCenterAside(center: Vector3, size: Vector3) {
  return {
    left: new Vector3(center.x - size.x / 2, center.y, center.z),
    right: new Vector3(center.x + size.x / 2, center.y, center.z),
    after: new Vector3(center.x, center.y, center.z - size.z / 2),
    before: new Vector3(center.x, center.y, center.z + size.z / 2),
  };
}

interface IGetPositionByTargetFurnitureProps {
  targetFurniture: {
    furniture: IFurniture | undefined,
    direction: "before" | "after" | "left" | "right",
  },
  originFurniture: IFurniture,
}

export function getPositionByTargetFurniture(
  { targetFurniture, originFurniture }: IGetPositionByTargetFurnitureProps
) {
  if (!targetFurniture.furniture || !targetFurniture.furniture.size || !originFurniture.size) return new Vector3();
  const targetCenter = new Vector3().applyMatrix4(targetFurniture.furniture.matrix);
  const originCenter = new Vector3().applyMatrix4(originFurniture.matrix);

  if (targetFurniture.direction === "before") {
    return new Vector3(
      targetCenter.x,
      originCenter.y,
      targetCenter.z - targetFurniture.furniture.size.z / 2 - originFurniture.size.z / 2
    );
  }
  if (targetFurniture.direction === "after") {
    return new Vector3(
      targetCenter.x,
      originCenter.y,
      targetCenter.z + targetFurniture.furniture.size.z / 2 + originFurniture.size.z / 2
    );
  }
  if (targetFurniture.direction === "left") {
    return new Vector3(
      targetCenter.x - targetFurniture.furniture.size.x / 2 - originFurniture.size.x / 2,
      originCenter.y,
      targetCenter.z
    );
  }
  if (targetFurniture.direction === "right") {
    return new Vector3(
      targetCenter.x + targetFurniture.furniture.size.x / 2 + originFurniture.size.x / 2,
      originCenter.y,
      targetCenter.z
    );
  }
  return new Vector3();
}