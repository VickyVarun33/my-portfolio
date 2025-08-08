import React, { useMemo } from "react";
import { useSpring, animated } from "@react-spring/three";

function Branch({ length, thickness, level }) {
  const angle = Math.random() * 0.5 + 0.2;
  const bend = Math.random() * 0.2;

  return (
    <mesh rotation={[bend, angle, 0]}>
      <cylinderGeometry args={[thickness, thickness * 0.8, length, 8]} />
      <meshStandardMaterial color="#3b2f2f" />
    </mesh>
  );
}

export default function Tree() {
  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: { mass: 2, tension: 180, friction: 40 }
  });

  const branches = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      arr.push(
        <Branch
          key={i}
          length={Math.random() * 1.5 + 1}
          thickness={0.05 + Math.random() * 0.05}
        />
      );
    }
    return arr;
  }, []);

  return (
    <animated.group scale={scale} position={[0, 1, 0]}>
      {/* Main trunk */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.2, 2, 12]} />
        <meshStandardMaterial color="#3b2f2f" />
      </mesh>

      {/* Branches */}
      {branches.map((b, i) => (
        <group key={i} position={[0, Math.random() * 2, 0]}>
          {b}
        </group>
      ))}
    </animated.group>
  );
}
