import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Robot from "../components/Robot";
import SeedMesh from "../components/SeedMesh";
import CinematicEffects from "../utils/CinematicEffects";
import HDRIEnvironment from "../utils/HDRIEnvironment";
import LeavesParticles from "../components/LeavesParticles";

/**
 * MainScene
 * - loads HDRI environment for realistic lighting
 * - controls camera choreography & phases
 * - coordinates robot & seed events
 */

export default function MainScene() {
  const { camera, gl } = useThree();
  const robotRef = useRef(null);
  const seedRef = useRef(null);
  const [phase, setPhase] = useState("enter"); // enter -> arrived -> dropping -> seedLanded -> tree

  // Responsive FOV
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

  // camera targets for cinematic moves
  const desiredPos = useRef(new THREE.Vector3(0, 1.0, 6));
  const desiredLook = useRef(new THREE.Vector3(0, 0.8, 0));
  function lerpVec(a, b, t) { a.lerp(b, t); }

  // main loop: camera + check phases
  useFrame((state, delta) => {
    // smooth camera targets depending on phase
    if (phase === "enter") {
      if (robotRef.current) {
        desiredPos.current.set(robotRef.current.position.x - 1.6, 1.2, 5.6);
        desiredLook.current.set(robotRef.current.position.x + 0.2, 0.4, 0);
      } else {
        desiredPos.current.set(0, 1.0, 6);
        desiredLook.current.set(0, 0.8, 0);
      }
    } else if (phase === "arrived") {
      desiredPos.current.set(0.2, 1.0, 4.0);
      desiredLook.current.set(0.2, 0.2, 0);
    } else if (phase === "dropping") {
      desiredPos.current.set(0.5, 1.15, 3.0);
      desiredLook.current.set(0.5, 0.0, 0);
    } else if (phase === "seedLanded") {
      desiredPos.current.set(0.6, 1.3, 3.2);
      desiredLook.current.set(0.6, 0.0, 0);
    } else if (phase === "tree") {
      desiredPos.current.set(0.8, 2.0, 8.0);
      desiredLook.current.set(0.8, 0.6, 0);
    }

    const lerpSpeed = Math.min(delta * 2.0, 1);
    lerpVec(camera.position, desiredPos.current.clone(), lerpSpeed);

    // compute a smooth lookAt
    const curDir = new THREE.Vector3();
    camera.getWorldDirection(curDir);
    const lookPoint = camera.position.clone().add(curDir.multiplyScalar(4));
    lerpVec(lookPoint, desiredLook.current.clone(), lerpSpeed);
    camera.lookAt(lookPoint);
  });

  // Listen to events dispatched by Robot/SeedMesh
  useEffect(() => {
    function onRobotArrived() {
      setPhase("arrived");
      setTimeout(() => setPhase("dropping"), 700);
    }
    function onSeedDropped() {
      setPhase("seedLanded");
      // after short delay start tree
      setTimeout(() => {
        setPhase("tree");
        window.dispatchEvent(new Event("seed:landed"));
        window.dispatchEvent(new Event("tree:start"));
      }, 700);
    }
    window.addEventListener("robot:arrived", onRobotArrived);
    window.addEventListener("seed:dropped", onSeedDropped);
    return () => {
      window.removeEventListener("robot:arrived", onRobotArrived);
      window.removeEventListener("seed:dropped", onSeedDropped);
    };
  }, []);

  return (
    <>
      {/* HDRI Environment (loads public/textures/studio.hdr) */}
      <HDRIEnvironment />

      {/* subtle ambient + key */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[8, 12, 5]} intensity={1.2} castShadow />

      {/* Glassy raindrop for atmosphere */}
      <mesh position={[0, 2.8, 0]}>
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

      {/* Leaves particles */}
      <LeavesParticles />

      {/* Robot (handles its arrival and seed release) */}
      <Robot ref={robotRef} seedRef={seedRef} />

      {/* Seed mesh follows robot until released, then falls (SeedMesh triggers 'seed:dropped') */}
      <SeedMesh ref={seedRef} />

      {/* Ground */}
      <mesh position={[0, -2.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#071028" />
      </mesh>

      {/* Postprocessing (bloom, DOF, grain, vignette) */}
      <CinematicEffects />

      {/* HTML overlay placeholder (TreeMount uses window events to mount) */}
      <Html fullscreen pointerEvents="none">
        <div id="dom-overlays" style={{ width: "100vw", height: "100vh", pointerEvents: "none" }} />
      </Html>
    </>
  );
}
