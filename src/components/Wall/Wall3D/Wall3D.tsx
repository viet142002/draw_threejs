import { Instance, Instances, useGLTF } from "@react-three/drei";
import { memo, useEffect, useRef } from "react";
import { Matrix4, Mesh } from "three";
import { useDrawStore } from "../../../stores/draw";

function Wall3D() {
  const { scene } = useGLTF("assets/models/4_panel.glb");
  const walls = useDrawStore(state => state.walls);

  return <>
    <Instances
      material={(scene.children[0] as Mesh).material}
      geometry={(scene.children[0] as Mesh).geometry}
    >
      {
        walls.map((wall) => {
          return wall?.matrix?.map((matrix, index) => {
            return <InstanceWall3D key={index} matrix={matrix} />
          })
        })
      }
    </Instances>
  </>
}

export default memo(Wall3D);

interface InstanceWall3DProps {
  matrix: Matrix4;
}

const InstanceWall3D = ({ matrix }: InstanceWall3DProps) => {
  const ref = useRef<Mesh>();
  useEffect(() => {
    if (ref.current) {
      ref.current.matrix.identity();
      ref.current.applyMatrix4(matrix);
    }
  }, [matrix]);
  return <Instance ref={ref} />
}
