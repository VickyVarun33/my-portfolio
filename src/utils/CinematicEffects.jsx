import React from "react";
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from "@react-three/postprocessing";

export default function CinematicEffects({ quality = "high" }) {
  const isLow = quality === "low";
  return (
    <EffectComposer>
      <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={isLow ? 2 : 6} height={480} />
      <Bloom luminanceThreshold={0.75} luminanceSmoothing={0.9} intensity={isLow ? 0.25 : 0.6} />
      <Noise opacity={isLow ? 0.02 : 0.035} />
      <Vignette eskil={false} offset={0.3} darkness={isLow ? 0.3 : 0.5} />
    </EffectComposer>
  );
}
