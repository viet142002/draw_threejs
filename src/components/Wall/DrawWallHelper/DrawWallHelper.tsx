import { useThree } from "@react-three/fiber";
import { usePointer } from "../../../hooks";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useDrawStore } from "../../../stores/draw";
import { HEIGHT_WALL } from "../../../constants";
import { getCenterFromPoints, getDistanceFromPoints, getPositionAxesFromPoints, getPositionDimFromPoints, getSnapWall } from "../../../utils";
import { Line, Text } from "@react-three/drei";
import { Vector3 } from "three";

function DrawWallHelper() {
  const { gl } = useThree();
  const { currentPosition } = usePointer();
  const { setWallDrawPoints, wallDrawPoints, isDrawWall, addWall, walls } = useDrawStore(state => state);
  const addDim = useDrawStore(state => state.addDim);

  const positionAxeFromStart = useMemo(() => getPositionAxesFromPoints(wallDrawPoints?.start || new Vector3(), currentPosition), [currentPosition, wallDrawPoints.start]);

  const pointsDim = useMemo(() => getPositionDimFromPoints(wallDrawPoints.start, positionAxeFromStart, 0.25, wallDrawPoints.snap), [positionAxeFromStart, wallDrawPoints.snap, wallDrawPoints.start]);

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
            snapStart: snap?.snapEnd ?? null,
            snapEnd: snap?.snapStart ?? null
          },
        },
        snap?.snapStart ? true : false
      );
      return;
    }
    const wallId = `wall_${new Date().getTime()}`

    addWall({
      start: wallDrawPoints.needRevertDirect ? getPositionAxesFromPoints(wallDrawPoints.start, currentPosition) : wallDrawPoints.start,
      end: wallDrawPoints.needRevertDirect ? wallDrawPoints.start : getPositionAxesFromPoints(wallDrawPoints.start, currentPosition),
      height: HEIGHT_WALL,
      id: wallId,
      snap: {
        snapStart: wallDrawPoints.snap.snapStart?.id ?? null,
        snapEnd: wallDrawPoints.snap.snapEnd?.id ?? null
      },
      ceil: null,
    });
    addDim({
      id: `dim_${new Date().getTime()}`,
      wallId: wallId,
      distance: getDistanceFromPoints(pointsDim.start, pointsDim.end),
      end: pointsDim.end,
      start: pointsDim.start,
    })
  }, [addDim, addWall, currentPosition, isDrawWall, pointsDim.end, pointsDim.start, setWallDrawPoints, wallDrawPoints.needRevertDirect, wallDrawPoints.snap.snapEnd?.id, wallDrawPoints.snap.snapStart?.id, wallDrawPoints.start, walls]);

  // draw wall realtime
  useEffect(() => {
    if (!isDrawWall || !wallDrawPoints.start) return;
    setWallDrawPoints({
      start: wallDrawPoints.start,
      end: positionAxeFromStart
    });
  }, [currentPosition, currentPosition.x, currentPosition.z, isDrawWall, positionAxeFromStart, setWallDrawPoints, wallDrawPoints.needRevertDirect, wallDrawPoints.start]);

  useEffect(() => {
    gl.domElement.style.cursor = "crosshair";
    gl.domElement.addEventListener('click', handleSetPoint);
    return () => {
      gl.domElement.style.cursor = "auto";
      gl.domElement.removeEventListener('click', handleSetPoint);
    }
  }, [gl.domElement, gl.domElement.style, handleSetPoint]);

  const p = useMemo(() => {
    const po = getSnapWall(walls, currentPosition);
    return po.snapEnd?.end ?? po.snapStart?.start ?? currentPosition;
  }, [currentPosition, walls]);

  return <>
    {wallDrawPoints && wallDrawPoints.start && <Dimension points={pointsDim} />}
    <mesh position={p}>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshBasicMaterial color="red" />
    </mesh>
  </>
}

export default memo(DrawWallHelper);

const Dimension = ({ points }: { points: { start: Vector3, end: Vector3 } }) => {
  return <>
    <Line
      points={[points.start, points.end]}
      color="yellow"
      lineWidth={4}
    />
    <Text rotation-x={-Math.PI / 2} fontSize={.2} position={getCenterFromPoints(points.start, points.end)}>
      {getDistanceFromPoints(points.start, points.end)}
    </Text>
  </>
}