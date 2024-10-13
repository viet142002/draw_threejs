import { useGLTF } from "@react-three/drei";
import { memo, useEffect, useMemo } from "react";
import { Box3, BoxGeometry, BufferGeometry, Euler, Material, Matrix4, Mesh, Plane, Quaternion, Vector3 } from "three";
import { useDrawWallStore, useDrawWindowStore } from "../../../stores";
import { SIZE_BRICK } from "../../../constants";
import { IWall } from "../../../types";
import { decompose } from "../../../utils/matrix";
import { useThree } from "@react-three/fiber";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { useShallow } from "zustand/react/shallow";

function Wall3D() {
    const walls = useDrawWallStore(useShallow(state => state.walls));
    const { windows, unableUpdate } = useDrawWindowStore(state => state);
    const { nodes } = useGLTF("assets/models/4_panel.glb");
    const { scene } = useThree();

    useEffect(() => {
        console.log('wall3d', walls);
    }, [walls]);


    const { material, geometry } = useMemo(() => {
        let material: Material | null = null;
        let geometry: BufferGeometry | null = null;
        if (nodes) {
            const mesh = nodes['4_panel'] as Mesh
            material = mesh.material as Material;
            geometry = mesh.geometry;
        }
        return { material, geometry };
    }, [nodes]);

    useEffect(() => {
        const distanceToFloor = 0.5;
        const evaluator = new Evaluator();
        windows.forEach(window => {
            const wallGroup = scene.getObjectByName(window.wallId);
            if (!wallGroup || !window.needUpdate) return;
            const windowBrush = new Brush(new BoxGeometry(window.width, window.height, window.depth + 0.5));
            windowBrush.applyMatrix4(window.matrix.clone().multiply(new Matrix4().setPosition(0, window.height / 2 + distanceToFloor, 0)));
            windowBrush.updateMatrixWorld();
            windowBrush.geometry.computeBoundingBox();
            const box3Window = windowBrush.geometry.boundingBox;
            box3Window?.applyMatrix4(window.matrix);
            const added: Array<Brush> = [];
            const needRemove: Array<Mesh> = [];
            wallGroup?.traverse((object) => {
                if (object instanceof Mesh && box3Window) {
                    object.updateMatrixWorld();
                    object.geometry.computeBoundingBox();
                    const box3Wall: Box3 = object.geometry.boundingBox;
                    box3Wall?.applyMatrix4(object.matrixWorld);
                    if (box3Wall.intersectsBox(box3Window)) {
                        console.log('intersect', object);
                        const wallBrush = new Brush(object.geometry, object.material);
                        wallBrush.applyMatrix4(object.matrixWorld);
                        wallBrush.updateMatrixWorld();
                        const result = evaluator.evaluate(wallBrush, windowBrush, SUBTRACTION);
                        added.push(result);
                        needRemove.push(object);
                    }
                }
            });
            if (added.length > 0) {
                console.log('added', added);
                wallGroup.remove(...needRemove);
                wallGroup?.add(...added);
                unableUpdate(window.id);
            }
        });
    }, [scene, unableUpdate, windows]);

    if (!material || !geometry) return null;
    return <>
        {walls.map((wall) => <WallGroup
            key={wall.id}
            wall={wall}
            geometry={geometry}
            material={material}
        />)}
    </>
}

export default memo(Wall3D);

interface WallGroupProps {
    wall: IWall;
    geometry: BufferGeometry;
    material: Material;
}

const WallGroup = memo(({ wall, geometry, material }: WallGroupProps) => {
    const { numberOfBrick, matrix, remainingLength, direction, end } = wall;
    if (!matrix) return null;
    return <group name={wall.id}>
        {Array(numberOfBrick).fill(0).map((_, index) => (
            <InstanceWall3D key={index} matrix={matrix?.[index]} geometry={geometry} material={material} />
        ))}
        {
            remainingLength > 0 && <>
                <InstanceWall3D
                    matrix={matrix?.[numberOfBrick]}
                    material={material}
                    geometry={geometry}
                    end={end}
                    remainingLength={remainingLength}
                    direction={direction}
                    wallHeight={wall.height}
                />
                <RemainderComponent
                    position={end}
                    direction={direction}
                    height={wall.height}
                />
            </>
        }

    </group>
})

interface InstanceWall3DProps {
    matrix: Matrix4;
    remainingLength?: number;
    direction?: Vector3;
    end?: Vector3;
    geometry: BufferGeometry;
    material: Material;
    wallHeight?: number;
}

const InstanceWall3D = memo(({ matrix, direction, end, geometry, material }: InstanceWall3DProps) => {
    const clipPlane = useMemo(() => {
        if (direction && end) {
            return new Plane().setFromNormalAndCoplanarPoint(direction.clone().multiplyScalar(-1), end);
        }
        return null;
    }, [direction, end]);

    const materialCut = useMemo(() => {
        if (!clipPlane) return material;
        const materialCut = material.clone();
        materialCut.clippingPlanes = [clipPlane];
        materialCut.clipIntersection = true;
        return materialCut;
    }, [material, clipPlane]);

    return <primitive object={new Mesh(geometry.clone(), materialCut)} {...decompose(matrix)} />
})

interface RemainderComponentProps {
    position: Vector3;
    direction: Vector3;
    height: number;
}

const RemainderComponent = ({ direction, height, position }: RemainderComponentProps) => {
    const { scene } = useGLTF("assets/models/4_panel_01_05.glb");

    const props = useMemo(() => {
        const quaternion = new Quaternion();
        quaternion.setFromUnitVectors(new Vector3(1, 0, 0), direction);
        const rotation = new Euler().setFromQuaternion(quaternion);
        const scale = new Vector3(1, height / SIZE_BRICK.height, 1);
        return {
            position: position.toArray() as [number, number, number],
            rotation: rotation.toArray() as [number, number, number],
            scale: scale.toArray() as [number, number, number]
        };
    }, [direction, height, position]);

    const clonedScene = useMemo(() => {
        const meshCloned = scene.children[0].clone() as Mesh;
        return meshCloned;
    }, [scene.children]);

    return <primitive object={clonedScene} {...props} />
}

