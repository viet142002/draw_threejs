import { Line } from "@react-three/drei";
import { useDrawStore } from "../../../stores/draw";
import { memo } from "react";

function Wall2D() {
  const walls = useDrawStore(state => state.walls);
  
  return <>
    {walls.map((wall, index) => (
      <Line key={index} points={[wall.start, wall.end]} color="blue" lineWidth={10} />
    ))}
  </>
}

export default memo(Wall2D);