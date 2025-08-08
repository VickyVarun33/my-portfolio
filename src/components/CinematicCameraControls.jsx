import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function CinematicCameraControls() {
  const { camera } = useThree();
  const zoomPhase = useRef(0);

  useFrame(() => {
    if (zoomPhase.current < 200) {
      camera.position.z -= 0.015;
      zoomPhase.current += 1;
    }
    if (zoomPhase.current >= 200 && zoomPhase.current < 400) {
      camera.position.x += Math.sin(zoomPhase.current * 0.005) * 0.02;
      camera.position.y += Math.cos(zoomPhase.current * 0.005) * 0.015;
      zoomPhase.current += 1;
    }
  });

  return null;
}
