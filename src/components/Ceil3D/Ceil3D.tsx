import * as THREE from "three";
import { useDrawStore } from "../../stores/draw";
import { memo, useMemo } from "react";
import { Shape } from "@react-three/drei";
import { ICeil, IWall } from "../../types";
import { getWallFromWallIds } from "../../utils";

function Ceil3D() {
  const ceils = useDrawStore(state => state.ceils);
  console.log("🚀 ~ Ceil3D ~ ceils:", ceils)
  const walls = useDrawStore(state => state.walls);

  return <>
    {ceils.map(ceil => (
      <CeilItem key={ceil.id} walls={walls} wallIds={ceil.wallIds} />
    ))}
  </>
}

export default memo(Ceil3D);

const CeilItem = ({ wallIds, walls }: { wallIds: ICeil['wallIds'], walls: Array<IWall> }) => {
  const wallOfCeil = getWallFromWallIds(walls, wallIds);
  const getHeight = () => wallOfCeil.reduce((acc, cur) => acc < cur.height ? acc = cur.height : acc, 0);
  const points = useMemo(() => {
    const points: Array<THREE.Vector3> = [];
    for (const [index, wall] of wallOfCeil.entries()) {
      const isLast = index === wallOfCeil.length;
      const isFirst = index === 0;
      if (isLast) {
        points.push(wall.end, wallOfCeil[0].start)
        continue;
      }
      if (isFirst) {
        points.push(wall.start, wall.end);
        continue;
      }
      points.push(wall.end)
    }
    return points;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallOfCeil, wallOfCeil.length]);

  const { shape, center } = useMemo(() => {
    const shape = new THREE.Shape();
    const center = new THREE.Vector3();
    if (points.length < 3) return { shape, center };
    points.forEach(point => {
      center.add(point)
    });
    center.divideScalar(points.length);
    shape.moveTo(points[0].x - center.x, points[0].z - center.z);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x - center.x, points[i].z - center.z);
    }
    shape.lineTo(points[0].x - center.x, points[0].z - center.z);

    return { shape, center };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, points.length]);
  // const maxHeight = Math.max(...height);

  if (points.length < 3) return null;
  return <group position={[center.x, getHeight(), center.z]}>
    <Shape args={[shape]} rotation={[Math.PI / 2, 0, 0]} >
      <meshStandardMaterial color={'red'} side={THREE.DoubleSide} />
    </Shape>
  </group>
}