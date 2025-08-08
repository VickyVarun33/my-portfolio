// Sky.jsx
import { useEffect, useState } from 'react';

export default function Sky() {
  const [skyColor, setSkyColor] = useState('bg-gradient-to-b from-[#aee0f4] to-[#e6f9ff]');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6 || hour >= 18)
      setSkyColor('bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]'); // Vibranium-inspired night
    else if (hour < 12)
      setSkyColor('bg-gradient-to-b from-[#aee0f4] via-[#bae6fd] to-[#e6f9ff]'); // Morning
    else
      setSkyColor('bg-gradient-to-b from-[#38bdf8] via-[#60a5fa] to-[#c7d2fe]'); // Day
  }, []);

  return <div className={`absolute inset-0 transition-colors duration-1000 ${skyColor}`} />;
}