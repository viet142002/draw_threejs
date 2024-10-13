import * as THREE from "three";
import { Geometry, Base, Subtraction } from '@react-three/csg'

function Corner() {


  return (
    null
    // <mesh castShadow receiveShadow>
    //   <Geometry useGroups>
    //     <Base position={[1, 1, 1]}>
    //       <boxGeometry args={[1, 1, 1]} />
    //       <meshStandardMaterial color="hotpink" side={THREE.DoubleSide} />
    //     </Base>
    //     <Subtraction name="cavity" position={[1, 4, 1]}>
    //       <boxGeometry args={[0.8, 0.8, 0.8]} />
    //     </Subtraction>
    //   </Geometry>
    // </mesh>
  )
}

export default Corner;