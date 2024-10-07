import { Line } from "@react-three/drei";
import { useDrawStore } from "../../../stores/draw";
import { memo } from "react";
import { useSelectStore } from "../../../stores/select";

function Wall2D() {
  const walls = useDrawStore(state => state.walls);
  const setSelected = useSelectStore(state => state.setSelected);

  const handleClick = (e: any) => {
    if (e?.object) {
      setSelected({ type: 'wall', ...e.object.userData });
    }
  }

  return <>
    {walls.map((wall, index) => (
      <Line onClick={handleClick} key={index} points={[wall.start, wall.end]} color="blue" lineWidth={10} userData={{
        id: wall.id,
        height: wall.height
      }} />
    ))}
  </>
}

export default memo(Wall2D);

// interface LineCustomProps {
//   points: [THREE.Vector3, THREE.Vector3];
//   color: string;
//   lineWidth: number;
//   userData: any;
// }
// const LineCustom = ({ points, color, lineWidth, userData }: LineCustomProps) => {
//   const ref = useRef<THREE.Line>(null);
//   const setSelected = useSelectStore(state => state.setSelected);

//   useEffect(() => {
//     if (ref.current) {
//       ref.current.userData = userData;
//     }
//   }, [userData]);

  

//   return (
//     <Line onClick={} points={points} color={color} lineWidth={lineWidth} userData={userData} />
//   );
// }