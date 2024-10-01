import { Environment, Grid, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { memo } from "react";
import Wall3D from "../Wall/Wall3D/Wall3D";

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
        camera={{
          position: [0, 4, 2],
          near: 0.000001,
          far: 1000,
          fov: 45,
        }}
        gl={{
          antialias: true,
        }}
      >
        <Environment preset="sunset" />
        <OrbitControls />
        <Grid args={[50, 50, 50]} />

        <Wall3D />
      </Canvas>
    </div>
  );
}

export default memo(Container3DViewer);