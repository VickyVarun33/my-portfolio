import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * SeedMesh:
 * - initially attached to robot via Robot component (Robot sets position)
 * - listens for 'robot:releaseSeed' to start falling
 * - when it hits ground (y <= -1.52), emits 'seed:dropped'
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

    if (dropping) {
      velocity.current += 0.0038; // gravity-ish
      meshRef.current.position.y -= velocity.current;
      meshRef.current.rotation.x += 0.03;
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.x += -0.005;

      if (meshRef.current.position.y <= -1.52) {
        setDropping(false);
        window.dispatchEvent(new Event("seed:dropped"));
      }
    } else {
      // not dropping: robot will position it via Robot.localToWorld LERP
    }
  });

  React.useImperativeHandle(ref, () => meshRef.current);

  return (
    <mesh ref={meshRef} position={[-4, 0.2, 0]}>
      <sphereGeometry args={[0.085, 16, 16]} />
      <meshStandardMaterial emissive="#ffd27a" color="#86b33a" metalness={0.2} roughness={0.25} />
    </mesh>
  );
});

export default SeedMesh;
