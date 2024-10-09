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

  useEffect(() => {
    console.log("walls", walls);
  }, [walls]);


  const positionAxeFromStart = useMemo(() => getPositionAxesFromPoints(wallDrawPoints?.start || new Vector3(), currentPosition), [currentPosition, wallDrawPoints.start]);

  const pointsDim = useMemo(() => getPositionDimFromPoints(wallDrawPoints.start, positionAxeFromStart, 0.25, wallDrawPoints.snap), [positionAxeFromStart, wallDrawPoints.snap, wallDrawPoints.start]);

  // set point for draw wall start and end
  const handleSetPoint = useCallback(() => {
    if (!isDrawWall) return;
    if (!wallDrawPoints.start) {
      const snap = getSnapWall(walls, currentPosition);
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
    const wallId = `wall_${new Date().getTime()}`;
    const { snap, start } = wallDrawPoints;
    const snapSecond = getSnapWall(walls, positionAxeFromStart, snap, 0.05);

    const newWall = {
      start: wallDrawPoints.needRevertDirect ? snapSecond.snapEnd?.end ?? positionAxeFromStart : start,
      end: wallDrawPoints.needRevertDirect ? start : snapSecond.snapStart?.start ?? positionAxeFromStart,
      height: HEIGHT_WALL,
      id: wallId,
      snap: {
        snapStart: snap.snapStart?.id ?? snapSecond.snapEnd?.id ?? null,
        snapEnd: snap.snapEnd?.id ?? snapSecond.snapStart?.id ?? null,
      },
      ceil: null,
    };
    addWall(newWall);
    const pointDim = getPositionDimFromPoints(newWall.start, newWall.end, 0.25, snap);
    addDim({
      id: `dim_${new Date().getTime()}`,
      wallId: wallId,
      distance: getDistanceFromPoints(pointDim.start, pointDim.end),
      end: pointDim.end,
      start: pointDim.start,
    })
  }, [addDim, addWall, currentPosition, isDrawWall, positionAxeFromStart, setWallDrawPoints, wallDrawPoints, walls]);

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