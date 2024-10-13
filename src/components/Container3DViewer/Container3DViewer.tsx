import { Environment, Grid, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { memo } from "react";
import Wall3D from "../Wall/Wall3D/Wall3D";
import Ceil3D from "../Ceil3D/Ceil3D";
import Corner from "../Corner/Corner";

interface Container3DViewerProps {
    className?: string;
}

function Container3DViewer({ className }: Container3DViewerProps) {
    return (
        <div
            className={className}
            style={{
                position: 'fixed',
                inset: 0,
            }}
        >
            <Canvas
                shadows
                gl={{
                    antialias: true,
                }}
                onCreated={({ gl }) => {
                    gl.localClippingEnabled = true;
                }}
            >
                <PerspectiveCamera makeDefault position={[0, 2, 5]} far={1000} near={0.001} />
                <color attach="background" args={['#f0f0f0']} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 8, -4]} shadow-mapSize={1024} castShadow />
                <Environment preset="city" blur={1} />
                <OrbitControls makeDefault />
                <Grid args={[50, 50, 50]} />

                <Wall3D />
                <Corner />
                <Ceil3D />
            </Canvas>
        </div>
    );
}

export default memo(Container3DViewer);