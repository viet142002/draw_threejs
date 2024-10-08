import { Text, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { rotateCorner } from "../../utils/rotateCorner";

function Corner() {
  const { scene } = useGLTF("assets/models/sk_corner_4.glb");
  const { scene: scene2 } = useGLTF("assets/models/4_panel.glb");
  // const { scene: scene2 } = useGLTF("assets/models/skf_corner_4.glb");
  const { scene: scene3 } = useGLTF("assets/models/4_panel_01_05.glb");
  const ref = useRef<Group>(null);

  useEffect(() => {
    if (!ref.current) return;
    // ref.current.applyMatrix4(rotateCorner('start-right'));
  }, []);

  return (
    <>
      {/* <primitive object={scene3} ref={ref} />
      <primitive object={scene2} position={[1, 0, 0]} /> */}
      <Text
        fontSize={0.1}
        rotation-x={-Math.PI / 2}
      >
        Hello world
      </Text>
    </>
  )
}

export default Corner;