import { Matrix4, Vector3, Quaternion } from "three";
import { ISnap, IWall } from "../types";
import { SPACE } from "../constants";

export const getLengthWall = (points: [Vector3, Vector3], brickWidth: number) => {
  const wallLength = points[0].distanceTo(points[1]);
  const numberOfBrick = Math.floor(wallLength / (brickWidth - SPACE));
  const remainingLength = wallLength - (numberOfBrick * (brickWidth - SPACE));
  return {
    numberOfBrick: numberOfBrick,
    // numberOfBrick: remainingLength > 0 ? numberOfBrick + 1 : numberOfBrick,
    wallLength,
    remainingLength,
  };
}

const getRotation = (point1: Vector3, point2: Vector3) => {
  const direction = new Vector3().subVectors(point2, point1).normalize();
  const quaternion = new Quaternion();
  quaternion.setFromUnitVectors(new Vector3(1, 0, 0), direction);
  return quaternion;
}

export const generateMatrixWallFromLength = (
  points: [Vector3, Vector3],
  height: number,
  sizeBrick: { width: number, height: number, depth: number },
) => {
  const { numberOfBrick, remainingLength } = getLengthWall(points, sizeBrick.width);
  const rotation = getRotation(points[0], points[1]);
  const direction = new Vector3().subVectors(points[1], points[0]).normalize();
  const startPoint = points[0].clone().add(direction.clone().multiplyScalar(sizeBrick.width / 2));

  const scale = new Vector3(1, height / sizeBrick.height, 1);

  const matrices: Matrix4[] = [];

  const totalBrick = remainingLength > 0 ? numberOfBrick + 1 : numberOfBrick;
  for (let i = 0; i < totalBrick; i++) {
    const m = new Matrix4();
    const position = new Vector3().addVectors(
      startPoint,
      direction.clone().multiplyScalar((sizeBrick.width - SPACE) * i)
    );
    m.compose(position, rotation, scale);
    matrices.push(m);
  }

  return { matrices, numberOfBrick, remainingLength, direction };
}

export const getPositionAxesFromPoints = (start: Vector3, target: Vector3) => {
  const newTarget = new Vector3(target.x, start.y, target.z);
  const positionOx = new Vector3(newTarget.x, newTarget.y, start.z);
  const positionOz = new Vector3(start.x, newTarget.y, newTarget.z);
  return detectMousemoveAxes(start, newTarget) === 'x' ? positionOx : positionOz;
}

export const detectMousemoveAxes = (start: Vector3, target: Vector3) => {
  const positionOx = new Vector3(start.x, start.y, target.z);
  const positionOz = new Vector3(target.x, start.y, start.z);
  if (target.distanceTo(positionOx) < target.distanceTo(positionOz)) return 'z';
  return 'x';
}

const DISTANCE = 0.2;
/**
 * Get snap wall from position mouse
 * @param walls 
 * @param position 
 * @returns 
 */
export const getSnapWall = (walls: Array<IWall>, position: Vector3) => {
  const snap: ISnap = {
    snapStart: null,
    snapEnd: null
  };
  for (const wall of walls) {
    if (wall.start.distanceTo(position) < DISTANCE && !wall.snap.snapStart) {
      snap.snapStart = wall;
    }
    if (wall.end.distanceTo(position) < DISTANCE && !wall.snap.snapEnd) {
      snap.snapEnd = wall;
    }
  }
  return snap;
};

export const getDirectionString = (start?: Vector3 | null, end?: Vector3 | null) => {
  if (!start || !end) return null;
  const direction = new Vector3().subVectors(end, start).normalize();
  if (direction.x > 0) return 'x';
  if (direction.x < 0) return '-x';
  if (direction.z < 0) return '-z';
  if (direction.z > 0) return 'z';
  return null;
}