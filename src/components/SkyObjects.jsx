// SkyObjects.jsx
import { useEffect, useRef } from 'react';

export default function SkyObjects() {
  const cloudRef = useRef();
  const sunRef = useRef();

  useEffect(() => {
    const cloud = cloudRef.current;
    let offset = 0;
    const move = () => {
      offset += 0.05;
      cloud.style.transform = `translateX(${offset}px)`;
      requestAnimationFrame(move);
    };
    move();
  }, []);

  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 18;
  const sunMoonStyle = {
    top: '10%',
    left: `${(hour / 24) * 100}%`
  };

  return (
    <>
      <div ref={cloudRef} className="absolute top-10 left-0 w-48 h-24 bg-white opacity-10 rounded-full blur-xl" />
      <div
        ref={sunRef}
        className={`absolute w-20 h-20 rounded-full ${isNight ? 'bg-yellow-100' : 'bg-yellow-400'} shadow-lg animate-pulse`}
        style={{ position: 'absolute', ...sunMoonStyle }}
      />
    </>
  );
}