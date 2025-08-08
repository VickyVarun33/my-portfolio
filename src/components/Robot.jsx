import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useSpring, animated } from "@react-spring/three";

export default function Robot({ onPlant }) {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, "/models/robot.glb");

  // Robot walk animation
  const { positionX } = useSpring({
    from: { positionX: -5 },
    to: async (next) => {
      await next({ positionX: 0 });
      onPlant();
    },
    config: { duration: 5000 }
  });

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
    }
  });

  return (
    <animated.group ref={group} position-x={positionX}>
      <primitive object={gltf.scene} scale={0.5} />
    </animated.group>
  );
}
