// Leaves.jsx
import { useEffect, useState } from 'react';

function randomLeaf() {
  return {
    id: Math.random(),
    left: Math.random() * 100,
    duration: 5 + Math.random() * 5
  };
}

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLeaves(prev => [...prev.filter(leaf => leaf.left > 0), randomLeaf()]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className="absolute w-4 h-4 bg-green-400 rounded-full opacity-70 animate-fall"
          style={{ left: `${leaf.left}%`, top: '-2%', animationDuration: `${leaf.duration}s` }}
        />
      ))}
    </>
  );
}
