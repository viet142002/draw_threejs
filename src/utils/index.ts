import { Matrix4, Vector3, Quaternion } from "three";

export const getLengthWall = (points: [Vector3, Vector3], sizeBrick: number) => {
  const lengthWall = points[0].distanceTo(points[1]);
  const quantity = Math.ceil(lengthWall / sizeBrick);
  return {
    quantity,
    length: quantity * sizeBrick
  };
}

export const getRotation = (point1: Vector3, point2: Vector3) => {
  const direction = new Vector3().subVectors(point2, point1).normalize();
  const quaternion = new Quaternion();
  quaternion.setFromUnitVectors(new Vector3(1, 0, 0), direction);
  return quaternion;
}

export const generateMatrixWallFromLength = (
  points: [Vector3, Vector3], 
  height: number, 
  sizeBrick: { width: number, height: number, depth: number }
) => {
  const { quantity: quantityBrick } = getLengthWall(points, sizeBrick.width);
  const rotation = getRotation(points[0], points[1]);

  const direction = new Vector3().subVectors(points[1], points[0]).normalize();
  const startPoint = new Vector3().addVectors(
    points[0],
    direction.multiplyScalar(sizeBrick.width / 2)
  );
  const scale = new Vector3(1, height/sizeBrick.height, 1);

  const matrices: Matrix4[] = [];

  for (let i = 0; i < quantityBrick; i++) {
    const m = new Matrix4();
    const position = new Vector3().addVectors(
      startPoint,
      new Vector3(
        direction.x * (sizeBrick.width + 1.3) * i,
        0,
        direction.z * (sizeBrick.width + 1.3) * i
      )
    );

    m.compose(position, rotation, scale);
    matrices.push(m);
  }

  return matrices;
}

export const getPositionAxesFromPoints = (start: Vector3, target: Vector3) => {
  const positionOx = new Vector3(target.x, target.y, start.z);
  const positionOz = new Vector3(start.x, target.y, target.z);
  return detectMousemoveAxes(start, target) === 'x' ? positionOx : positionOz;
}

export const detectMousemoveAxes = (start: Vector3, target: Vector3) => {
  const DELTA = 2;
  if (Math.abs(start.x - target.x) < DELTA) return 'z';
  return 'x';
}