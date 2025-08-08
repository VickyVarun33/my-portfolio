// src/scenes/MainScene.jsx
import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import CinematicEffects from "../utils/CinematicEffects";

// NOTE: this file assumes your robot.glb is at /public/robot.glb
// and that Tree component (DOM canvas) will be mounted by TreeMount when `tree:start` event fires.

export default function MainScene() {
  const { camera, gl } = useThree();

  // Refs
  const robotRef = useRef();
  const seedRef = useRef();
  const treeRootRef = useRef();

  // State phases: 'enter' -> 'arrived' -> 'dropping' -> 'seedLanded' -> 'tree'
  const [phase, setPhase] = useState("enter");

  // Load robot model
  const { scene: robotScene, animations } = useGLTF("/robot.glb");

  // Adaptive quality: reduce heavy effects on low DPR or small screens
  const deviceDpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  const quality = deviceDpr <= 1.25 ? "low" : "high";

  // Camera Dolly / Crane parameters
  // We'll smoothly lerp camera position/orientation for cinematic shots
  const camTarget = useRef(new THREE.Vector3(0, 0.8, 4.5));
  const camLookAt = useRef(new THREE.Vector3(0, 0.8, 0));
  const camVelocity = useRef(new THREE.Vector3()); // used for smoothing

  // Walking parameters
  const targetX = 0; // where robot stops
  const walkSpeedBase = 0.028;
  let bobPhase = 0;

  // helper to get child by name safely
  const findChildByName = (root, name) => root?.getObjectByName?.(name) || null;

  // Make sure scene casts shadow
  useEffect(() => {
    if (robotRef.current) {
      robotRef.current.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
    }
  }, []);

  // Responsive camera FOV tuning
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      camera.fov = w < 640 ? 72 : w < 1024 ? 62 : 55;
      camera.updateProjectionMatrix();
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [camera]);

  // Frame loop: robot motion, seed drop, camera dolly and crane
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // --- Robot entry / walking with bob & slight rotation ---
    if (robotRef.current && phase === "enter") {
      const speed = walkSpeedBase * (1 + Math.sin(t * 0.5) * 0.08); // tiny speed variance
      robotRef.current.position.x += speed;
      robotRef.current.rotation.y = Math.sin(t * 0.6) * 0.02;

      bobPhase += delta * 7;
      robotRef.current.position.y = -1 + Math.sin(bobPhase) * 0.02;

      if (robotRef.current.position.x >= targetX) {
        // arrived
        setPhase("arrived");
        // schedule drop
        setTimeout(() => setPhase("dropping"), 700);
      }
    }

    // --- Seed attach to robot then drop ---
    if (robotRef.current && seedRef.current && (phase === "enter" || phase === "arrived")) {
      // attach seed to a point in robot local space (front/hand)
      // create a vector in robot local coords:
      const localAttach = new THREE.Vector3(0.7, 0.2, 0); // tweak if needed
      robotRef.current.localToWorld(localAttach);
      seedRef.current.position.lerp(localAttach, 0.35); // smooth follow
    }

    if (phase === "dropping" && seedRef.current) {
      // drop down with easing
      seedRef.current.position.y -= 0.06;
      seedRef.current.position.x -= 0.01;
      // small rotation
      seedRef.current.rotation.x += 0.03;
      if (seedRef.current.position.y <= -1.5) {
        // landed
        setPhase("seedLanded");
        // slight delay then trigger tree start and camera crane move
        setTimeout(() => {
          setPhase("tree");
          // dispatch DOM event so TreeMount can mount 2D tree canvas
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("seed:landed"));
            window.dispatchEvent(new Event("tree:start"));
          }
        }, 700);
      }
    }

    // --- Camera cinematic dolly/crane behavior ---
    // We'll have camera smoothly interpolate between preset positions depending on phase
    let desiredPos = new THREE.Vector3(0, 0.8, 4.5); // default
    let desiredLook = new THREE.Vector3(0, 0.9, 0);

    if (phase === "enter") {
      // slowly follow robot from behind-left slightly
      if (robotRef.current) {
        desiredPos = new THREE.Vector3(robotRef.current.position.x - 1.6, 0.9, 4.5);
        desiredLook = new THREE.Vector3(robotRef.current.position.x + 0.2, 0.5, 0);
      }
    } else if (phase === "arrived") {
      desiredPos = new THREE.Vector3(0, 1.0, 3.8);
      desiredLook = new THREE.Vector3(0, 0.8, 0);
    } else if (phase === "dropping") {
      // push slightly forward for drama
      desiredPos = new THREE.Vector3(0.2, 1.0, 3.0);
      desiredLook = new THREE.Vector3(0.3, 0.2, 0);
    } else if (phase === "seedLanded") {
      desiredPos = new THREE.Vector3(0.6, 1.2, 2.6);
      desiredLook = new THREE.Vector3(0.6, -0.2, 0);
    } else if (phase === "tree") {
      // crane up and out (zoom out) while tree grows - cinematic reveal
      desiredPos = new THREE.Vector3(0.8, 2.2, 6.5);
      desiredLook = new THREE.Vector3(0.8, 0.6, 0);
    }

    // smooth lerp camera position and lookAt
    camera.position.lerp(desiredPos, Math.min(delta * 2.0, 1));
    // smooth lookAt
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook);
    // compute current look-at point by adding direction to position
    const lookPoint = camera.position.clone().add(currentLook.multiplyScalar(4));
    // lerp toward desiredLook point
    lookPoint.lerp(desiredLook, Math.min(delta * 2.0, 1));
    camera.lookAt(lookPoint);

    // subtle parallax background glide
    // (we could animate Environment or sky color later)
  });

  // Clean up GLTF loader caches on unmount (optional)
  useEffect(() => {
    return () => {
      try {
        // dispose if needed
        // useGLTF.cache && useGLTF.clear && useGLTF.clear();
      } catch (e) {}
    };
  }, []);

  return (
    <>
      {/* lights + environment */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 12, 5]} intensity={1.2} castShadow />
      <Environment preset="sunset" />

      {/* HDR-style raindrop above scene */}
      <mesh position={[0, 2.9, 0]}>
        <sphereGeometry args={[0.22, 64, 64]} />
        <meshPhysicalMaterial
          color="#dff3ff"
          transmission={0.95}
          roughness={0.0}
          metalness={0}
          thickness={1.0}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>

      {/* Robot primitive using your GLB */}
      <primitive
        ref={robotRef}
        object={robotScene}
        position={[-5, -1.0, 0]}
        scale={0.8}
        receiveShadow
        castShadow
      />

      {/* Seed mesh (follows robot until dropping) */}
      <mesh ref={seedRef} position={[-4, 0.2, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial emissive="#ffd27a" color="#86b33a" metalness={0.2} roughness={0.25} />
      </mesh>

      {/* Ground plane */}
      <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#071028" />
      </mesh>

      {/* placeholder group for subtle tree sway */}
      <group ref={treeRootRef} />

      {/* Cinematic postprocessing */}
      <CinematicEffects quality={quality} />

      {/* HTML overlay: used to host the DOM 2D Tree canvas (rendered by TreeMount on 'tree:start') */}
      <Html fullscreen pointerEvents="none">
        <div id="dom-overlays" style={{ width: "100vw", height: "100vh", pointerEvents: "none" }} />
      </Html>
    </>
  );
}
