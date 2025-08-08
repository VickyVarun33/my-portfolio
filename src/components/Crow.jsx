// Crow.jsx
import { useEffect, useState } from 'react';

export default function Crow({ onDrop }) {
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState(-200);
  const [dropped, setDropped] = useState(false);

  useEffect(() => {
    let frame;
    const fly = () => {
      setPosition(prev => {
        const next = prev + 4;
        if (!dropped && next >= window.innerWidth / 2) {
          onDrop();
          setDropped(true);
        }
        if (next > window.innerWidth + 200) setVisible(false);
        return next;
      });
      frame = requestAnimationFrame(fly);
    };
    fly();
    return () => cancelAnimationFrame(frame);
  }, [onDrop, dropped]);

  if (!visible) return null;

  return (
    <div
      className="absolute top-1/4 z-30 w-24 h-16 bg-gradient-to-b from-gray-900 to-black rounded-b-full shadow-2xl rotate-[10deg]"
      style={{ left: position }}
    >
      <div className="absolute left-1/2 top-full w-2.5 h-5 bg-amber-800 rounded-full animate-bounce"></div>
    </div>
  );
}