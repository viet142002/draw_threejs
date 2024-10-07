import * as THREE from "three";
import { useDrawStore } from "../../stores/draw";
import { memo, useMemo } from "react";
import { Shape } from "@react-three/drei";

function Ceil3D() {
  const ceils = useDrawStore(state => state.ceils);
  return <>
    {ceils.map(ceil => (
      <CeilItem key={ceil.id} points={ceil.points} height={ceil.height} />
    ))}
  </>
}

export default memo(Ceil3D);

const CeilItem = ({ points, height }: { points: Array<THREE.Vector3>, height: Array<number> }) => {
  console.log("🚀 ~ CeilItem ~ height:", height)
  const { shape, center } = useMemo(() => {
    const shape = new THREE.Shape();
    const center = new THREE.Vector3();
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
  const maxHeight = Math.max(...height);

  if (points.length < 3) return null;
  return <group position={[center.x, maxHeight, center.z]}>
    <Shape args={[shape]} rotation={[Math.PI / 2, 0, 0]} >
      <meshStandardMaterial color={'red'} side={THREE.DoubleSide} />
    </Shape>
  </group>
}