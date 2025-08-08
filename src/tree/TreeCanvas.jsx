// src/tree/TreeCanvas.jsx
import React, { useEffect, useRef } from "react";

/**
 * TreeCanvas draws roots first, then trunk, then branches.
 * After branches finish growing we compute node positions and dispatch window event 'tree:nodes'
 * with detail = array of node data: [{id,x,y,title,description}, ...]
 */
export default function TreeCanvas() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = window.innerWidth / 2;
    const groundY = window.innerHeight * 0.78;

    ctx.lineCap = "round";

    // draw roots (animated)
    function drawRoots() {
      const rootCount = 6;
      for (let i = 0; i < rootCount; i++) {
        const startX = centerX + (i - rootCount / 2) * 20;
        const startY = groundY;
        drawCurvedLine(startX, startY, startX + (Math.random() * 60 - 30), startY + 100 + Math.random() * 40, 6 - i * 0.6, "#5a3d2b");
      }
    }

    function drawTrunk() {
      drawCurvedLine(centerX, groundY, centerX, groundY - 220, 14, "#372612");
    }

    // store branch end positions for nodes
    const nodePositions = [];

    function drawBranches() {
      const baseX = centerX;
      const baseY = groundY - 200;
      function recurse(x, y, angle, depth) {
        if (depth === 0) {
          // node - record for overlay (approx)
          nodePositions.push({ id: Math.random().toString(36).slice(2), x: x, y: y, title: "Skill", description: "Click to view details" });
          return;
        }
        const len = 30 + depth * 12;
        const x2 = x + Math.cos(angle) * len;
        const y2 = y - Math.sin(angle) * len;
        drawCurvedLine(x, y, x2, y2, Math.max(1, depth * 1.6), `hsl(${80 - depth * 6}, 45%, ${30 + depth * 2}%)`);
        // slight delay between recursive branches to look like growth
        recurse(x2, y2, angle - 0.5 + (Math.random() - 0.5) * 0.3, depth - 1);
        recurse(x2, y2, angle + 0.2 + (Math.random() - 0.5) * 0.4, depth - 1);
      }
      recurse(baseX, baseY, -Math.PI / 2, 5);
    }

    function drawCurvedLine(x1, y1, x2, y2, width, color) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      const cx = (x1 + x2) / 2 + (Math.random() * 30 - 15);
      const cy = (y1 + y2) / 2 + (Math.random() * 30 - 10);
      ctx.quadraticCurveTo(cx, cy, x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    // staged animation: roots -> trunk -> branches
    setTimeout(() => {
      drawRoots();
      setTimeout(() => {
        drawTrunk();
        setTimeout(() => {
          drawBranches();
          // after branches drawn, publish nodes (converted to screen px)
          setTimeout(() => {
            const detail = nodePositions.map((n) => ({ ...n }));
            // convert canvas coordinates (already in CSS px) so they match window coords
            window.dispatchEvent(new CustomEvent("tree:nodes", { detail }));
          }, 800);
        }, 700);
      }, 500);
    }, 400);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 20, pointerEvents: "none" }} />;
}
