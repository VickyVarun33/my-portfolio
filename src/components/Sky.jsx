// Sky.jsx
import { useEffect, useState } from 'react';

export default function Sky() {
  const [skyColor, setSkyColor] = useState('bg-blue-200');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6 || hour >= 18) setSkyColor('bg-indigo-900'); // Night
    else if (hour < 12) setSkyColor('bg-sky-300'); // Morning
    else setSkyColor('bg-blue-500'); // Day
  }, []);

  return <div className={`absolute inset-0 transition-colors duration-1000 ${skyColor}`} />;
}