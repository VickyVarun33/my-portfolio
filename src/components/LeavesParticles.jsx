import React, { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function LeavesParticles({ count = 50 }) {
  const leaves = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: new THREE.Vector3((Math.random() - 0.5) * 10, Math.random() * 6 + 1.5, (Math.random() - 0.5) * 6),
        speed: 0.002 + Math.random() * 0.004,
        rot: Math.random() * Math.PI * 2
      });
    }
    return arr;
  }, [count]);

  useFrame(() => {
    leaves.forEach((leaf) => {
      leaf.pos.y -= leaf.speed;
      leaf.pos.x += Math.sin(Date.now() * 0.001 + leaf.rot) * 0.0006;
      leaf.rot += 0.001;
      if (leaf.pos.y < -2) {
        leaf.pos.y = Math.random() * 6 + 3;
      }
    });
  });

  return (
    <group>
      {leaves.map((leaf, i) => (
        <mesh key={i} position={leaf.pos} rotation={[0, leaf.rot, 0]}>
          <planeGeometry args={[0.22, 0.38]} />
          <meshStandardMaterial color="#6bc24a" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
