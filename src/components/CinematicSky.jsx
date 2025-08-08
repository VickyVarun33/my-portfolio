import React from "react";
import { Sky } from "@react-three/drei";

export default function CinematicSky({ time }) {
  return (
    <Sky
      distance={450000}
      sunPosition={[0, time === "day" ? 1 : -1, 0]}
      inclination={0}
      azimuth={0.25}
    />
  );
}
