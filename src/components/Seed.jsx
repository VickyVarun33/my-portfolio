// Seed.jsx
import { useEffect, useState } from 'react';

export default function Seed({ trigger, onFinish }) {
  const [pos, setPos] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setVisible(true);
    let y = 0;
    const fall = () => {
      y += 3;
      setPos(y);
      if (y >= window.innerHeight * 0.75) {
        setTimeout(() => onFinish(), 500);
        return;
      }
      requestAnimationFrame(fall);
    };
    fall();
  }, [trigger]);

  if (!visible) return null;

  return (
    <div
      className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-900 rounded-full shadow-md z-30"
      style={{ top: pos }}
    />
  );
}