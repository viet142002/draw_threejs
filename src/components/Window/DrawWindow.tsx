import { Box } from "@react-three/drei";
import { usePointer } from "../../hooks";
import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDrawWallStore, useDrawStore, useDrawWindowStore } from "../../stores";
import { IWindow } from "../../types";
import { Line3, Matrix4, Mesh, Quaternion, Vector3 } from "three";
import { SIZE_BRICK } from "../../constants";

function DrawWindow() {
    const { gl } = useThree();
    const { walls } = useDrawWallStore();
    const { setDraw } = useDrawStore();
    const { addWindow } = useDrawWindowStore();
    const { currentPosition } = usePointer();
    const ref = useRef<Mesh>(null);

    const { matrixWindow, wallId } = useMemo(() => {
        const matrix = new Matrix4();
        const distance = 0.5;
        let wallId = "";
        walls.forEach(wall => {
            const line = new Line3(wall.start, wall.end);
            const pointParameter = line.closestPointToPointParameter(currentPosition, true);
            const point = new Vector3();
            line.at(pointParameter, point);
            const distanceFromPoint = currentPosition.distanceTo(point);
            if (distanceFromPoint < distance) {
                const dir = new Vector3().subVectors(wall.end, wall.start).normalize();
                const quaternion = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0), dir);
                matrix.compose(point, quaternion, new Vector3(1, 1, 1));
                wallId = wall.id;
            }
        });
        return { matrixWindow: matrix, wallId };
    }, [currentPosition, walls]);



    const handleSetPoint = useCallback(() => {
        const newWindow: IWindow = {
            id: `window_${new Date().getTime()}`,
            wallId: wallId,
            matrix: matrixWindow,
            width: 1.5,
            height: 1,
            // depth: 0.3,
            depth: SIZE_BRICK.depth,
            needUpdate: true
        }
        addWindow(newWindow);
        setDraw(null);
    }, [addWindow, matrixWindow, setDraw, wallId]);


    useEffect(() => {
        gl.domElement.addEventListener("click", handleSetPoint);
        return () => {
            gl.domElement.removeEventListener("click", handleSetPoint);
        }
    }, [gl.domElement, handleSetPoint])

    useEffect(() => {
        if (ref.current) {
            ref.current.matrix.copy(matrixWindow);
            ref.current.matrixAutoUpdate = false;
        }
    }, [matrixWindow]);

    return <>
        <Box
            ref={ref}
            matrix={matrixWindow} args={[1.5, 1, 0.3]} />
    </>
}

export default DrawWindow;