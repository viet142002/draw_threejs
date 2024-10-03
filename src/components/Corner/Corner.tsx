import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group } from "three";
import { rotateCorner } from "../../utils/rotateCorner";

function Corner() {
  const { scene } = useGLTF("assets/models/sk_corner_4.glb");
  const { scene: scene2 } = useGLTF("assets/models/skf_corner_4.glb");
  const ref = useRef<Group>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.applyMatrix4(rotateCorner('start-right'));
  }, []);


  return (
    <>
      <primitive object={scene} ref={ref} />
      <primitive object={scene2} position={[1,0,0]} />
    </>
)}

export default Corner;