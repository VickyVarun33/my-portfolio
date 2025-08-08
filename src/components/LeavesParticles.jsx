import React, { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function LeavesParticles() {
  const leaves = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 50; i++) {
      arr.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          Math.random() * 5 + 2,
          (Math.random() - 0.5) * 10
        ),
        speed: Math.random() * 0.005 + 0.002
      });
    }
    return arr;
  }, []);

  useFrame(() => {
    leaves.forEach((leaf) => {
      leaf.position.y -= leaf.speed;
      leaf.position.x += Math.sin(Date.now() * 0.001) * 0.001;
      if (leaf.position.y < 0) {
        leaf.position.y = Math.random() * 5 + 2;
      }
    });
  });

  return (
    <group>
      {leaves.map((leaf, i) => (
        <mesh key={i} position={leaf.position}>
          <planeGeometry args={[0.2, 0.4]} />
          <meshStandardMaterial color="#4CAF50" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
