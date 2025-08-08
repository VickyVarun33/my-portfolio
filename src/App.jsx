// src/App.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import MainScene from "./scenes/MainScene";
import "./index.css";
import TreeMount from "./TreeMount";

export default function App() {
  return (
    <div className="w-screen h-screen bg-gradient-to-b from-[#0b1226] via-[#10203a] to-[#0b2a3a]">
      <Canvas
        camera={{ position: [0, 1.8, 6], fov: 55 }}
        gl={{ antialias: true, physicallyCorrectLights: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <MainScene />
        </Suspense>
      </Canvas>
      <TreeMount/>
    </div>
  );
}
