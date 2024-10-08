import { useDrawStore } from "../../stores/draw";
import { Text, Line } from "@react-three/drei";
import { getCenterFromPoints } from "../../utils";

function Dimension() {
  const dims = useDrawStore(state => state.dims);
  return <>
    {
      dims.map(d => (
        <>
          <Line
            points={[d.start, d.end]}
            color="yellow"
            lineWidth={4}
          />
          <Text rotation-x={-Math.PI / 2} fontSize={.2} position={getCenterFromPoints(d.start, d.end)}>
            {d.distance}
          </Text>
        </>
      ))
    }
  </>
}

export default Dimension;