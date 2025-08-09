// src/components/Raindrop.jsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import RaindropMaterial from "../materials/RaindropMaterial";

export default function Raindrop({
  position = [0, 1.5, 0],
  scale = 0.15,
  distortionStrength = 0.15,
  chromaticAberration = false,
}) {
  const dropRef = useRef();

  // Animate small wobble and rotation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (dropRef.current) {
      dropRef.current.rotation.x = Math.sin(t * 0.6) * 0.1;
      dropRef.current.rotation.z = Math.cos(t * 0.4) * 0.1;
      dropRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.02; // slight bounce
    }
  });

  // A stretched sphere to look like a raindrop
  return (
    <mesh ref={dropRef} position={position} scale={[scale, scale * 1.3, scale]}>
      <sphereGeometry args={[1, 64, 64]} />
      <RaindropMaterial
        distortionStrength={distortionStrength}
        chromaticAberration={chromaticAberration}
      />
    </mesh>
  );
}
