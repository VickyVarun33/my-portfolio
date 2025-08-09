// src/materials/RaindropMaterial.jsx
import React, { useMemo, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RaindropMaterial({
  transmission = 1,
  thickness = 0.3,
  roughness = 0,
  ior = 1.33,
  distortionStrength = 0.15, // how wavy the reflections look
  chromaticAberration = false,
  bloomBoost = false, // optional cinematic highlights
}) {
  const { scene } = useThree();

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      transmission,
      thickness,
      roughness,
      ior,
      reflectivity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0,
      metalness: 0,
      envMap: scene.environment || null,
      envMapIntensity: 1.5,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uDistortionStrength = { value: distortionStrength };
      shader.uniforms.uTime = { value: 0 };

      shader.vertexShader =
        `
        varying vec3 vWorldPosition;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        `#include <worldpos_vertex>`,
        `
          #include <worldpos_vertex>
          vWorldPosition = worldPosition.xyz;
        `
      );

      shader.fragmentShader =
        `
        uniform float uDistortionStrength;
        uniform float uTime;
        varying vec3 vWorldPosition;

        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        }
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <envmap_physical_pars_fragment>`,
        `
          #include <envmap_physical_pars_fragment>
          vec3 distortNormal(vec3 normal, vec3 pos) {
            float n = noise(pos * 3.0 + uTime * 0.5);
            vec3 rand = normalize(vec3(
              noise(pos + vec3(1.0, 0.0, 0.0)),
              noise(pos + vec3(0.0, 1.0, 0.0)),
              noise(pos + vec3(0.0, 0.0, 1.0))
            ));
            return normalize(mix(normal, rand, n * uDistortionStrength));
          }
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        `vec3 totalSpecular = vec3( 0.0 );`,
        `
          geometry.normal = distortNormal(geometry.normal, vWorldPosition);
          vec3 totalSpecular = vec3(0.0);
        `
      );

      if (chromaticAberration) {
        shader.fragmentShader = shader.fragmentShader.replace(
          `totalDiffuse = RE_IndirectDiffuse( irradiance, geometry.normal );`,
          `
            vec3 col = RE_IndirectDiffuse( irradiance, geometry.normal );
            totalDiffuse = vec3(col.r, col.g * 0.98, col.b * 0.96);
          `
        );
      }

      if (bloomBoost) {
        shader.fragmentShader = shader.fragmentShader.replace(
          `vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;`,
          `
            vec3 outgoingLight = totalDiffuse + totalSpecular * 1.5 + totalEmissiveRadiance;
          `
        );
      }

      mat.userData.shader = shader;
    };

    return mat;
  }, [
    scene.environment,
    transmission,
    thickness,
    roughness,
    ior,
    distortionStrength,
    chromaticAberration,
    bloomBoost,
  ]);

  // Update envMap dynamically if HDRI loads later
  useEffect(() => {
    if (scene.environment && material) {
      material.envMap = scene.environment;
      material.needsUpdate = true;
    }
  }, [scene.environment, material]);

  // Animate distortion over time
  useFrame(({ clock }) => {
    if (material.userData.shader) {
      material.userData.shader.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return <primitive object={material} attach="material" />;
}
