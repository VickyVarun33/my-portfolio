import React, { useEffect, useRef } from "react";

/**
 * TreeCanvas draws roots first, then trunk, then branches.
 * After branches drawn, dispatches 'tree:nodes' with positions for clickable nodes.
 */
export default function TreeCanvas() {
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";

    const centerX = window.innerWidth / 2;
    const groundY = window.innerHeight * 0.78;

    // helper to draw a curved branch/line with style
    function drawCurvedLine(x1, y1, x2, y2, width, color) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      const cx = (x1 + x2) / 2 + (Math.random() * 40 - 20);
      const cy = (y1 + y2) / 2 + (Math.random() * 30 - 10);
      ctx.quadraticCurveTo(cx, cy, x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    // Draw animated roots/trunk/branches in stages
    const nodePositions = [];

    function drawRoots() {
      const rootCount = 5;
      for (let i = 0; i < rootCount; i++) {
        const startX = centerX + (i - rootCount / 2) * 24;
        const startY = groundY;
        const endX = startX + (Math.random() * 80 - 40);
        const endY = groundY + 120 + Math.random() * 40;
        drawCurvedLine(startX, startY, endX, endY, 6 - i * 0.7, "#4b2f1b");
      }
    }

    function drawTrunk() {
      drawCurvedLine(centerX, groundY, centerX, groundY - 240, 18, "#34220f");
    }

    function drawBranches() {
      function recurse(x, y, angle, depth) {
        if (depth === 0) {
          nodePositions.push({ id: Math.random().toString(36).slice(2), x, y, title: "Skill", description: "Details here" });
          return;
        }
        const len = 40 + depth * 10;
        const x2 = x + Math.cos(angle) * len;
        const y2 = y - Math.sin(angle) * len;
        drawCurvedLine(x, y, x2, y2, Math.max(1, depth * 1.6), `hsl(${70 - depth * 8}, 40%, ${30 + depth * 2}%)`);
        recurse(x2, y2, angle - 0.45 + (Math.random() - 0.5) * 0.3, depth - 1);
        recurse(x2, y2, angle + 0.25 + (Math.random() - 0.5) * 0.3, depth - 1);
      }
      recurse(centerX, groundY - 220, -Math.PI / 2, 5);
    }

    // staged draw with delays for cinematic growth
    setTimeout(() => {
      drawRoots();
      setTimeout(() => {
        drawTrunk();
        setTimeout(() => {
          drawBranches();
          setTimeout(() => {
            // dispatch nodes with positions (they are in screen pixels already)
            window.dispatchEvent(new CustomEvent("tree:nodes", { detail: nodePositions }));
          }, 600);
        }, 800);
      }, 500);
    }, 450);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 25, pointerEvents: "none" }} />;
}
