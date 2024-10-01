import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Vector3, Plane, Vector2, Raycaster } from "three";

export function usePointer() {
    const { gl, camera } = useThree();
    const [mousePointer, setMousePointer] = useState<Vector2>(new Vector2());

    const raycaster = useMemo(() => {
      const newRay = new Raycaster();
      newRay.setFromCamera(mousePointer, camera);
      return newRay;    
    }, [camera, mousePointer]);

    const plane = useMemo(() => {
        const p = new Plane();
        p.setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), new Vector3(0, 0, 0));
        return p;
    }, []);

    const currentPosition = useMemo(() => {
        const ray = raycaster.ray;
        const intersectPoint = ray.intersectPlane(plane, new Vector3());
        return new Vector3(intersectPoint?.x, intersectPoint?.y, intersectPoint?.z);
    }, [plane, raycaster]);

    const onPointerMove = useCallback((event: MouseEvent) => {
        setMousePointer(new Vector2(
            (event.clientX / gl.domElement.clientWidth) * 2 - 1,
            -(event.clientY / gl.domElement.clientHeight) * 2 + 1
        ));
    }, [gl.domElement.clientHeight, gl.domElement.clientWidth]);

    useEffect(() => {
        gl.domElement.addEventListener("mousemove", onPointerMove);
        return () => {
            gl.domElement.removeEventListener("mousemove", onPointerMove);
        };
    }, [gl.domElement, onPointerMove]);

    return { currentPosition };
}