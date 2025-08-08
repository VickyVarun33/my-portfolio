// src/components/SeedMesh.jsx
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * SeedMesh:
 * - starts off-screen until Robot attaches it (Robot will position it via world coords).
 * - listens for 'robot:releaseSeed' to start falling with physics-like easing.
 * - when it hits ground (y <= -1.5), emits 'seed:dropped' DOM event.
 */
const SeedMesh = forwardRef((props, ref) => {
  const meshRef = useRef();
  const [dropping, setDropping] = useState(false);
  const velocity = useRef(0);

  useEffect(() => {
    function onRelease() {
      setDropping(true);
      velocity.current = 0.02;
    }
    window.addEventListener("robot:releaseSeed", onRelease);
    return () => window.removeEventListener("robot:releaseSeed", onRelease);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // If not yet visible/attached by robot, keep it near robot spawn (we start hidden left)
    if (!dropping) {
      // keep where it is (Robot will set world position via localToWorld)
    } else {
      // falling physics-ish
      velocity.current += 0.0035; // acceleration
      meshRef.current.position.y -= velocity.current;
      meshRef.current.rotation.x += 0.03;
      meshRef.current.rotation.y += 0.02;
      // slight forward motion
      meshRef.current.position.x += -0.005;

      if (meshRef.current.position.y <= -1.52) {
        // landed
        setDropping(false);
        window.dispatchEvent(new Event("seed:dropped"));
      }
    }
  });

  // expose ref
  React.useImperativeHandle(ref, () => meshRef.current, []);

  // visible by default, can be moved by Robot until dropped
  return (
    <mesh ref={meshRef} position={[-4, 0.2, 0]}>
      <sphereGeometry args={[0.085, 16, 16]} />
      <meshStandardMaterial emissive="#ffd27a" color="#8cc63f" metalness={0.2} roughness={0.25} />
    </mesh>
  );
});

export default SeedMesh;
