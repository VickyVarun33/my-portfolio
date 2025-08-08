// src/components/Tree.jsx
import React, { useEffect, useRef } from "react";

export default function Tree({ start = false }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // drawing tree L-system-like growing with delays
    function drawBranch(x, y, angle, depth) {
      if (depth === 0) return;
      const length = depth * 12;
      const xEnd = x + Math.cos(angle) * length;
      const yEnd = y - Math.sin(angle) * length;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x, y - length / 2, xEnd, yEnd - length / 2, xEnd, yEnd);
      ctx.strokeStyle = `hsl(120, 40%, ${30 + depth * 5}%)`;
      ctx.lineWidth = Math.max(1, depth * 0.9);
      ctx.lineCap = "round";
      ctx.stroke();

      setTimeout(() => {
        drawBranch(xEnd, yEnd, angle - 0.3 - Math.random() * 0.2, depth - 1);
        drawBranch(xEnd, yEnd, angle + 0.3 + Math.random() * 0.2, depth - 1);
      }, 350);
    }

    // start growth when start === true
    if (start) {
      setTimeout(() => {
        drawBranch(canvas.width / (2 * (window.devicePixelRatio || 1)), (canvas.height / (window.devicePixelRatio || 1)) * 0.85, -Math.PI / 2, 10);
      }, 600);
    }

    return () => window.removeEventListener("resize", resize);
  }, [start]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 25,
        pointerEvents: "none",
      }}
    />
  );
}
