import { useThree } from "@react-three/fiber";
import { usePointer } from "../../../hooks";
import { useCallback, useEffect } from "react";
import { useDrawStore } from "../../../stores/draw";

function DrawWallHelper() {
  const { gl } = useThree();
  const { currentPosition } = usePointer();
  const { setWallDrawPoints, wallDrawPoints, resetStore, isDrawWall, addWall } = useDrawStore(state => state);

  const handleSetPoint = useCallback(() => {
    if (!isDrawWall) return;
    if (!wallDrawPoints.start) {
      setWallDrawPoints({ start: currentPosition, end: currentPosition });
      return;
    } 
    addWall({ start: wallDrawPoints.start, end: currentPosition });
  }, [addWall, currentPosition, isDrawWall, setWallDrawPoints, wallDrawPoints.start]);

  useEffect(() => {
    if (!isDrawWall || !wallDrawPoints.start) return;
    setWallDrawPoints({ start: wallDrawPoints.start, end: currentPosition });
  }, [currentPosition, currentPosition.x, currentPosition.z, isDrawWall, resetStore, setWallDrawPoints, wallDrawPoints.start])

  useEffect(() => {
    gl.domElement.style.cursor = "crosshair";
    gl.domElement.addEventListener('click', handleSetPoint);
    return () => {
      gl.domElement.style.cursor = "auto";
      gl.domElement.removeEventListener('click', handleSetPoint);
    }
  }, [gl.domElement, gl.domElement.style, handleSetPoint]);
  

  return <>
    <mesh position={currentPosition}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="red" />
    </mesh>
  </>
}

export default DrawWallHelper;