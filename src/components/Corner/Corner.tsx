import { useGLTF } from "@react-three/drei";

function Corner() {
  const { scene } = useGLTF("assets/models/sk_corner_4.glb");
  return (
    <>
      <primitive object={scene} />
    </>
)}

export default Corner;