import React from "react";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";

export default function CinematicEffects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
      <Noise opacity={0.05} />
    </EffectComposer>
  );
}
