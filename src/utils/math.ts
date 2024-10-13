import { Matrix4, Vector3 } from "three";
import { getDirectionString } from "./drawWall";
import { ISnap, IWall } from "../types";

export const getDistanceFromPoints = (start: Vector3, end: Vector3) => {
    if (!start || !end) return 0;
    return +start.distanceTo(end).toFixed(2);
}

export const getCenterFromPoints = (start: Vector3, end: Vector3) => {
    if (!start) return new Vector3();
    if (!end) return start;
    return start.clone().add(end).divideScalar(2);
}

export const getPositionDimFromPoints = (start?: Vector3 | null, end?: Vector3, delta: number = 0.25, snap?: ISnap | null) => {
    const vector3 = new Vector3();
    const deltaCoords = 0.2;
    const matrixPoint = new Matrix4();
    matrixPoint.setPosition(vector3);
    if (!start || !end) return { matrixPoint, start: vector3, end: vector3 };
    const direction = getDirectionString(start, end);
    const centerSnap = snap?.snapEnd ? getCenterFromPoints(snap.snapEnd.start, snap.snapEnd.end) : snap?.snapStart ? getCenterFromPoints(snap.snapStart.start, snap.snapStart.end) : null;
    if (!direction) return { matrixPoint, start: vector3, end: vector3 };
    if (direction.includes('x')) {
        if (centerSnap && centerSnap.z < end.z) {
            const p = start.clone().add(end).divideScalar(2).add(new Vector3(0, 0, delta + deltaCoords));
            matrixPoint.setPosition(p);
            return {
                matrixPoint,
                start: start.clone().add(new Vector3(0, 0, delta)),
                end: end.clone().add(new Vector3(0, 0, delta))
            };
        }
        const p = start.clone().add(end).divideScalar(2).add(new Vector3(0, 0, -(delta + deltaCoords)));
        matrixPoint.setPosition(p);
        return {
            matrixPoint,
            start: start.clone().add(new Vector3(0, 0, -delta)),
            end: end.clone().add(new Vector3(0, 0, -delta))
        };
    }
    if (direction.includes('z')) {
        matrixPoint.makeRotationZ(Math.PI / 2);
        if (centerSnap && centerSnap?.x < end.x) {
            const p = start.clone().add(end).divideScalar(2).add(new Vector3(delta + deltaCoords, 0, 0));
            matrixPoint.setPosition(p);
            return {
                matrixPoint,
                start: start.clone().add(new Vector3(delta, 0, 0)),
                end: end.clone().add(new Vector3(delta, 0, 0))
            }
        }
        const p = start.clone().add(end).divideScalar(2).add(new Vector3(-(delta + deltaCoords), 0, 0));
        matrixPoint.setPosition(p);
        return {
            matrixPoint,
            start: start.clone().add(new Vector3(-delta, 0, 0)),
            end: end.clone().add(new Vector3(-delta, 0, 0))
        }
    }
    return {
        matrixPoint,
        start: vector3,
        end: vector3,
    }
}

export const getWallFromWallIds = (walls: Array<IWall>, ids: Array<string>) => {
    const needWall = walls.filter(wall => ids.includes(wall.id));
    if (!needWall.length) return [];
    return ids.map(id => needWall.find(wall => wall.id === id)).filter(wall => wall !== undefined);
}