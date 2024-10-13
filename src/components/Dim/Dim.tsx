import { useDrawWallStore } from "../../stores";
import { Text, Line } from "@react-three/drei";
import { decompose } from "../../utils/matrix";
import { getDirectionString, getDistanceFromPoints } from "../../utils";
import { Matrix4, Mesh, MeshBasicMaterial, Shape, ShapeGeometry, Vector3 } from "three";
import { useMemo } from "react";

function Dimension() {
    const dims = useDrawWallStore(state => state.dims);
    return <>
        {
            dims.map(d => (
                <Dim
                    key={d.id}
                    start={d.start}
                    end={d.end}
                    matrix={d.matrixPoint}
                    distance={d.distance}
                />
            ))
        }
    </>
}

export default Dimension;

interface DimProps {
    start: Vector3,
    end: Vector3,
    matrix: Matrix4,
    distance?: number
}


export const Dim = ({ start, end, matrix, distance }: DimProps) => {
    const mat = useMemo(() => new MeshBasicMaterial({ color: 0xffff00 }), []);
    const dir = useMemo(() => {
        const dir = new Vector3().subVectors(end, start).normalize();
        return {
            dir,
            string: getDirectionString(undefined, undefined, dir)
        };
    }, [start, end]);

    const arrowLeftShapeMesh = useMemo(() => {
        const shape = new Shape();
        const delta = 0.05;
        shape.moveTo(0, 0);
        if (dir.string?.includes('x')) {
            shape.lineTo(dir.dir.x * delta, dir.dir.x * delta);
            shape.lineTo(dir.dir.x * delta, -(dir.dir.x * delta));
        } else {
            shape.lineTo((dir.dir.z * delta), -(dir.dir.z * delta));
            shape.lineTo(-(dir.dir.z * delta), -(dir.dir.z * delta));
        }
        shape.lineTo(0, 0);
        return new Mesh(new ShapeGeometry(shape), mat);
    }, [dir.dir.x, dir.dir.z, dir.string, mat]);

    const arrowRightShapeMesh = useMemo(() => {
        const shape = new Shape();
        const delta = 0.05;
        shape.moveTo(0, 0);
        // shape.lineTo(-(dir.x * delta), dir.x * delta);
        // shape.lineTo(-(dir.x * delta), -(dir.x * delta));
        if (dir.string?.includes('x')) {
            shape.lineTo(-(dir.dir.x * delta), dir.dir.x * delta);
            shape.lineTo(-(dir.dir.x * delta), -(dir.dir.x * delta));
        } else {
            shape.lineTo((dir.dir.z * delta), (dir.dir.z * delta));
            shape.lineTo(-(dir.dir.z * delta), (dir.dir.z * delta));
        }
        shape.lineTo(0, 0);
        return new Mesh(new ShapeGeometry(shape), mat);
    }, [dir.dir.x, dir.dir.z, dir.string, mat]);

    return <>
        <Line
            points={[start, end]}
            color="yellow"
            lineWidth={2}
        />
        <primitive object={arrowLeftShapeMesh} rotation-x={-Math.PI / 2} position={start} />
        <primitive object={arrowRightShapeMesh} rotation-x={-Math.PI / 2} position={end} />
        <Text fontSize={.2}  {...decompose(matrix)} rotation-x={-Math.PI / 2} >
            {distance ?? getDistanceFromPoints(start, end)}
        </Text>
    </>
}