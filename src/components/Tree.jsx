// Tree.jsx
import { useEffect, useRef } from 'react';

export default function Tree() {
  const treeRef = useRef(null);

  useEffect(() => {
    const canvas = treeRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function drawBranch(x, y, angle, depth) {
      if (depth === 0) return;

      const length = depth * 10;
      const xEnd = x + Math.cos(angle) * length;
      const yEnd = y - Math.sin(angle) * length;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x, y - length / 2, xEnd, yEnd - length / 2, xEnd, yEnd);
      ctx.strokeStyle = `hsl(120, 40%, ${30 + depth * 5}%)`;
      ctx.lineWidth = depth;
      ctx.stroke();

      setTimeout(() => {
        drawBranch(xEnd, yEnd, angle - 0.2 - Math.random() * 0.2, depth - 1);
        drawBranch(xEnd, yEnd, angle + 0.2 + Math.random() * 0.2, depth - 1);
      }, 300);
    }

    drawBranch(canvas.width / 2, canvas.height, -Math.PI / 2, 10);
  }, []);

  return <canvas ref={treeRef} className="absolute inset-0 z-10" />;
}