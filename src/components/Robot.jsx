import React, { forwardRef, useEffect, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

/**
 * Robot component:
 * - walks in from left
 * - attaches seed position while planting
 * - dispatches 'robot:arrived' and 'robot:releaseSeed' events
 */

const Robot = forwardRef(({ seedRef }, ref) => {
  const gltf = useLoader(GLTFLoader, "/models/robot.glb");
  const group = useRef();
  const local = useRef({ arrived: false, dropScheduled: false, isDropping: false });

  useEffect(() => {
    if (group.current) {
      group.current.position.set(-6, -1, 0);
      group.current.rotation.y = 0.3;
    }
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Walk in
    if (!local.current.arrived) {
      group.current.position.x += delta * 1.2;
      const bob = Math.sin(state.clock.elapsedTime * 5.5) * 0.02;
      group.current.position.y = -1 + bob;
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.02;

      if (group.current.position.x >= -0.4) {
        local.current.arrived = true;
        window.dispatchEvent(new Event("robot:arrived"));
        // schedule planting animation
        setTimeout(() => {
          local.current.isDropping = true;
        }, 700);
      }
    }

    // While arrived and before drop: try minor planting pose
    if (local.current.arrived && !local.current.isDropping) {
      const arm = group.current.getObjectByName?.("Arm") || group.current.getObjectByName?.("arm");
      if (arm) arm.rotation.x = -0.25 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }

    // When dropping: set seed attach pos then release
    if (local.current.isDropping) {
      if (seedRef?.current && group.current) {
        const attachLocal = new THREE.Vector3(0.7, 0.18, 0);
        group.current.localToWorld(attachLocal);
        seedRef.current.position.lerp(attachLocal, 0.35);
        if (!local.current.dropScheduled) {
          local.current.dropScheduled = true;
          setTimeout(() => {
            window.dispatchEvent(new Event("robot:releaseSeed"));
          }, 400);
        }
      }
    }
  });

  // expose internal ref
  React.useImperativeHandle(ref, () => group.current);

  return <primitive ref={group} object={gltf.scene} scale={0.85} />;
});

export default Robot;
