import { Line } from "@react-three/drei";
import { useDrawStore } from "../../../stores/draw";

function DrawWall() {
  const { start, end } = useDrawStore(state => state.wallDrawPoints);
  return <>
    {start && <Line points={[
        start || [0, 0, 0],
        end || [0, 0, 0]
      ]} 
      color="red" 
      lineWidth={10}
    />}
  </>
}

export default DrawWall;