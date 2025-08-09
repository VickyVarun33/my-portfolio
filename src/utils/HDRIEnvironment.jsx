import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import * as THREE from "three";

export default function HDRIEnvironment() {
  const { scene, gl } = useThree();

  useEffect(() => {
    const loader = new EXRLoader();
    loader.load("/studio.exr", (texture) => {
      // ✅ Correct settings for HDRI (.exr)
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.type = THREE.HalfFloatType; // HDR float
      texture.colorSpace = THREE.LinearSRGBColorSpace; // Keep linear

      // Convert to PMREM for better reflections
      const pmremGenerator = new THREE.PMREMGenerator(gl);
      pmremGenerator.compileEquirectangularShader();
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;

      // Assign environment & background
      scene.environment = envMap;
      scene.background = envMap;

      // Optional: background blur
      scene.backgroundBlurriness = 0.25;

      // Cleanup
      texture.dispose();
      pmremGenerator.dispose();
    });
  }, [scene, gl]);

  return null;
}
