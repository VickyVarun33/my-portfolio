// src/utils/Effects.jsx
import React from "react";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";

export default function Effects() {
  return (
    <EffectComposer>
      <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={6} height={480} />
      <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.9} intensity={0.6} />
    </EffectComposer>
  );
}
