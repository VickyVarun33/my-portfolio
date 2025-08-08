import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function MainScene() {
  const robotRef = useRef();
  const seedRef = useRef();
  const treeRef = useRef();

  const [robotReached, setRobotReached] = useState(false);
  const [seedDropped, setSeedDropped] = useState(false);
  const [treeGrowing, setTreeGrowing] = useState(false);

  // Load robot model (replace with realistic one later)
  const { scene: robot } = useGLTF("/robot.glb");

  // Animate robot entering and stopping at seed spot
  useFrame(() => {
    if (robotRef.current && !robotReached) {
      robotRef.current.position.x += 0.02;
      if (robotRef.current.position.x >= 0) {
        setRobotReached(true);
      }
    }

    // Drop seed
    if (robotReached && !seedDropped && seedRef.current) {
      seedRef.current.position.y -= 0.03;
      if (seedRef.current.position.y <= -1.5) {
        setSeedDropped(true);
        setTimeout(() => setTreeGrowing(true), 1000);
      }
    }

    // Grow tree
    if (treeGrowing && treeRef.current && treeRef.current.scale.y < 1) {
      treeRef.current.scale.y += 0.01;
    }
  });

  return (
    <>
      {/* HDR-style raindrop */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshPhysicalMaterial
          transparent
          transmission={1}
          roughness={0}
          thickness={1.5}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>

      {/* Robot entering from left */}
      <primitive
        object={robot}
        ref={robotRef}
        scale={0.6}
        position={[-5, -1.5, 0]}
      />

      {/* Seed dropped by robot */}
      <mesh ref={seedRef} position={[0, 1, 0]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="green" />
      </mesh>

      {/* Tree growing from seed */}
      <mesh
        ref={treeRef}
        position={[0, -1.5, 0]}
        scale={[0.2, 0.01, 0.2]}
      >
        <cylinderGeometry args={[0.1, 0.1, 2, 12]} />
        <meshStandardMaterial color="saddlebrown" />
      </mesh>
    </>
  );
}
