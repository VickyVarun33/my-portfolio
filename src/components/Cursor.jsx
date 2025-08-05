// Cursor.jsx
import { useEffect, useState } from 'react';

export default function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = e => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      className="fixed w-4 h-4 rounded-full bg-white opacity-80 pointer-events-none z-50 transition-transform duration-75"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    />
  );
}