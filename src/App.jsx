import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import MainScene from "../src/scenes/MainScene";

export default function App() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <MainScene />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
