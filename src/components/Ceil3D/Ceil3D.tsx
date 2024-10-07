import * as THREE from "three";
import { useDrawStore } from "../../stores/draw";
import { memo, useEffect, useMemo } from "react";
import { Shape } from "@react-three/drei";

function Ceil3D() {
  const ceils = useDrawStore(state => state.ceils);
  useEffect(() => {
    console.log("🚀 ~ Ceil3D ~ ceils:", ceils)
  }, [ceils])

  return <>
    {
      ceils.map(ceil => (
        <CeilItem key={ceil.id} points={ceil.points} />
      ))
    }
  </>
}

export default memo(Ceil3D);

const CeilItem = ({ points }: { points: Array<THREE.Vector3> }) => {
  const { shape, center, height } = useMemo(() => {
    let height = 0;
    const shape = new THREE.Shape();
    const center = new THREE.Vector3();
    points.forEach(point => {
      center.add(point);
      if (point.y > height) height = point.y;
    });
    center.divideScalar(points.length);
    shape.moveTo(points[0].x - center.x, points[0].z - center.z);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x - center.x, points[i].z - center.z);
    }
    shape.lineTo(points[0].x - center.x, points[0].z - center.z);

    return { shape, center, height };
  }, [points]);

  if (points.length < 3) return null;
  return <group position={[center.x, height, center.z]}>
    <Shape args={[shape]} rotation={[Math.PI / 2, 0, 0]} >
      <meshStandardMaterial color={'red'} side={THREE.DoubleSide} />
    </Shape>
  </group>
}