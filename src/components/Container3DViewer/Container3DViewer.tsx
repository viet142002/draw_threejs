import { Environment, Grid, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { memo } from "react";
import Wall3D from "../Wall/Wall3D/Wall3D";
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
        gl={{
          antialias: true,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 1, 5]} near={0.001} far={1000} />
        <Environment preset="sunset" />
        <OrbitControls />
        <Grid args={[50, 50, 50]} />

        <Wall3D />
        <Corner />
      </Canvas>
    </div>
  );
}

export default memo(Container3DViewer);