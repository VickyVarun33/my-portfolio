import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

import HDRIEnvironment from "./utils/HDRIEnvironment";
import MainScene from "./scenes/MainScene";
import TreeMount from "./tree/TreeMount";
import Raindrop from "./components/Raindrop"; // <- your raindrop component

export default function App() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{ position: [0, 1.6, 6], fov: 55 }}
        shadows
        gl={{
          antialias: true,
          physicallyCorrectLights: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding,
        }}
        dpr={[1, 2]}
        onCreated={({ gl, scene }) => {
          gl.toneMappingExposure = 1.2;
          scene.backgroundBlurriness = 0.3;
        }}
      >
        <Suspense fallback={null}>
          {/* ✅ HDRI lighting for entire scene */}
          <HDRIEnvironment />

          {/* ✅ Cinematic bloom */}
          <EffectComposer>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.2}
              blendFunction={BlendFunction.SCREEN}
            />
          </EffectComposer>

          {/* ✅ Main scene & tree */}
          <MainScene />

          {/* ✅ Single focus raindrop (glass with HDR reflections) */}
          <Raindrop position={[0, 2, 0]} scale={0.15} />

          {/* ✅ Dev controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      {/* ✅ DOM overlays */}
      <TreeMount />
    </div>
  );
}
