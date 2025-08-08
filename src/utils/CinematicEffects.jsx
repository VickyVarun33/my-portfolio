// src/utils/CinematicEffects.jsx
import React from "react";
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function CinematicEffects({ quality = "high" }) {
  // Adjust intensities depending on quality
  const isLow = quality === "low";

  return (
    <EffectComposer disableNormalPass>
      {/* Depth of field: subtle focusing for cinematic feel */}
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.02}
        bokehScale={isLow ? 2 : 6}
        height={480}
      />

      {/* Bloom for highlights */}
      <Bloom
        luminanceThreshold={0.7}
        luminanceSmoothing={0.9}
        intensity={isLow ? 0.25 : 0.6}
        kernelSize={isLow ? 3 : 5}
        mipmapBlur
      />

      {/* Chromatic aberration for film-like edge separation */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={isLow ? [0.001, 0.001] : [0.0025, 0.002]}
      />

      {/* Noise / film grain */}
      <Noise opacity={isLow ? 0.02 : 0.05} />

      {/* Vignette - darkened edges for cinematic letterbox vibe */}
      <Vignette eskil={false} offset={0.3} darkness={isLow ? 0.3 : 0.5} />
    </EffectComposer>
  );
}
