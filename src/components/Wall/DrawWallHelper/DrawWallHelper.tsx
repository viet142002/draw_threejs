import { useThree } from "@react-three/fiber";
import { usePointer } from "../../../hooks";
import { memo, useCallback, useEffect } from "react";
import { useDrawStore } from "../../../stores/draw";
import { HEIGHT_WALL } from "../../../constants";
import { getPositionAxesFromPoints, getSnapWall } from "../../../utils";

function DrawWallHelper() {
  const { gl } = useThree();
  const { currentPosition } = usePointer();
  const { setWallDrawPoints, wallDrawPoints, isDrawWall, addWall, walls } = useDrawStore(state => state);

  // set point for draw wall start and end
  const handleSetPoint = useCallback(() => {
    if (!isDrawWall) return;
    const snap = getSnapWall(walls, currentPosition);
    if (!wallDrawPoints.start) {
      setWallDrawPoints(
        {
          start: snap?.snapEnd?.end ?? snap?.snapStart?.start ?? currentPosition,
          end: snap?.snapEnd?.end ?? snap?.snapStart?.start ?? currentPosition,
          snap: {
            snapStart: snap?.snapEnd?.id ?? null,
            snapEnd: snap?.snapStart?.id ?? null
          },
        },
        snap?.snapStart ? true : false
      );
      return;
    }

    addWall({
      start: wallDrawPoints.needRevertDirect ? getPositionAxesFromPoints(wallDrawPoints.start, currentPosition) : wallDrawPoints.start,
      end: wallDrawPoints.needRevertDirect ? wallDrawPoints.start : getPositionAxesFromPoints(wallDrawPoints.start, currentPosition),
      height: HEIGHT_WALL,
      id: `wall_${new Date().getTime()}`,
      snap: {
        snapStart: wallDrawPoints.snap.snapStart ?? null,
        snapEnd: wallDrawPoints.snap.snapEnd ?? null
      },
      ceil: null
    });
  }, [addWall, currentPosition, isDrawWall, setWallDrawPoints, wallDrawPoints.needRevertDirect, wallDrawPoints.snap.snapEnd, wallDrawPoints.snap.snapStart, wallDrawPoints.start, walls]);

  // draw wall realtime
  useEffect(() => {
    if (!isDrawWall || !wallDrawPoints.start) return;
    setWallDrawPoints({
      start: wallDrawPoints.start,
      end: getPositionAxesFromPoints(wallDrawPoints.start, currentPosition)
    });
  }, [currentPosition, currentPosition.x, currentPosition.z, isDrawWall, setWallDrawPoints, wallDrawPoints.needRevertDirect, wallDrawPoints.start])

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
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshBasicMaterial color="red" />
    </mesh>
  </>
}

export default memo(DrawWallHelper);