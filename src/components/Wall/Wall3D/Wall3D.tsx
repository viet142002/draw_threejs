import { useGLTF } from "@react-three/drei";
import { Fragment, memo, useEffect, useMemo, useRef } from "react";
import { Group, Matrix4, Mesh, Plane, Quaternion, Vector3 } from "three";
import { useDrawStore } from "../../../stores/draw";
import { SIZE_BRICK } from "../../../constants";

function Wall3D() {
  const walls = useDrawStore(state => state.walls);

  return <>
    <group>
      {
        walls.map((wall) => {
          const { numberOfBrick, matrix, remainingLength, direction, id, end } = wall;
          if (!matrix) return null;
          return <Fragment key={id}>
            {Array(numberOfBrick).fill(0).map((_, index) => (<InstanceWall3D key={index} matrix={matrix?.[index]} />))}
            {
              remainingLength > 0 && <>
                <InstanceWall3D
                  matrix={matrix?.[numberOfBrick]}
                  remainingLength={remainingLength}
                  direction={direction}
                  end={end}
                />
                <RemainderComponent
                  position={end}
                  direction={direction}
                  height={wall.height}
                />
              </>
            }
          </Fragment>
        })
      }
    </group>
  </>
}

export default memo(Wall3D);

interface InstanceWall3DProps {
  matrix: Matrix4;
  remainingLength?: number;
  direction?: Vector3;
  end?: Vector3;
}

const InstanceWall3D = ({ matrix, remainingLength, direction, end }: InstanceWall3DProps) => {
  const ref = useRef<Group>();
  const { scene } = useGLTF("assets/models/4_panel.glb");

  const obj = useMemo(() => {
    let objScene: Mesh | null = null;
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof Mesh) {
          objScene = new Mesh(child.geometry.clone(), child.material.clone());
        }
      });
    }
    return objScene;
  }, [scene]);

  const clipPlane = useMemo(() => {
    if (direction && end) {
      return new Plane().setFromNormalAndCoplanarPoint(direction.multiplyScalar(-1), end);
    }
    return null;
  }, [direction, end]);
  useEffect(() => {
    if (ref.current && matrix) {
      const current = ref.current;
      current.matrix.copy(matrix);
      current.matrixAutoUpdate = false;
      if (current && remainingLength && clipPlane && current instanceof Mesh) {
        current.material.clippingPlanes = [clipPlane];
        current.material.clipIntersection = true;
        current.material.needsUpdate = true;
      }
    }
  }, [clipPlane, direction, end, matrix, remainingLength]);

  if (!obj) return null;
  return <primitive ref={ref} object={obj} />
}

interface RemainderComponentProps {
  position: Vector3;
  direction: Vector3;
  height: number;
}

const RemainderComponent = ({ direction, height, position }: RemainderComponentProps) => {
  const { scene } = useGLTF("assets/models/4_panel_01_05.glb");
  const ref = useRef<Group>();

  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const matrix = useMemo(() => {
    const m = new Matrix4();
    const rotation = new Quaternion();
    rotation.setFromUnitVectors(new Vector3(-1, 0, 0), direction);
    const scale = new Vector3(1, height / SIZE_BRICK.height, 1);
    m.compose(position, rotation, scale);
    return m;
  }, [direction, height, position]);

  useEffect(() => {
    if (ref.current) {
      ref.current.matrix.copy(matrix);
      ref.current.matrixAutoUpdate = false;
    }
  }, [matrix]);

  return <primitive object={clonedScene} ref={ref} />
}