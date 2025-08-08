import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Robot from "./Robot";
import Tree from "./Tree";
import CinematicSky from "./CinematicSky";
import LeavesParticles from "./LeavesParticles";

function CameraAnimation({ planted }) {
  const cam = useRef();
  useFrame(({ camera }) => {
    if (!planted) {
      camera.position.lerp({ x: -5, y: 2, z: 8 }, 0.02);
    } else {
      camera.position.lerp({ x: 0, y: 2, z: 6 }, 0.02);
    }
    camera.lookAt(0, 1, 0);
  });
  return null;
}

export default function MainScene() {
  const [treePlanted, setTreePlanted] = useState(false);

  return (
    <Canvas camera={{ position: [-5, 2, 8], fov: 60 }}>
      <fog attach="fog" args={["#000000", 5, 20]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <CinematicSky time={treePlanted ? "day" : "night"} />
      <CameraAnimation planted={treePlanted} />
      <LeavesParticles />
      <Robot onPlant={() => setTreePlanted(true)} />
      {treePlanted && <Tree />}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
