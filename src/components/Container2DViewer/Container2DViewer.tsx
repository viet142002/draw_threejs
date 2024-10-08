import { memo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Grid, OrbitControls } from "@react-three/drei";
import DrawContainer from "../DrawContainer/DrawContainer";
import Wall2D from "../Wall/Wall2D/Wall2D";
import Edit from "../Edit/Edit";
import Dimension from "../Dim/Dim";

interface Container2DViewerProps {
  className?: string;
}

function Container2DViewer({ className }: Container2DViewerProps) {

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
      }}
    >
      <Canvas
        orthographic
        camera={{
          position: [0, 5, 0],
          zoom: 100,
        }}
        gl={{
          antialias: true,
        }}
      >
        <Environment preset="studio" />
        <OrbitControls
          makeDefault
          enableRotate={false}
        />
        <Grid args={[50, 50, 50]} />

        <DrawContainer />

        <Wall2D />
        <Dimension />
      </Canvas>
      <Edit />
    </div>
  );
}

export default memo(Container2DViewer);