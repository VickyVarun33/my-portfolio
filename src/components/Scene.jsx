import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function Scene() {
  const robotControls = useAnimation();
  const seedControls = useAnimation();
  const [showSeed, setShowSeed] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      await robotControls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 2, ease: "easeInOut" },
      });
      setShowSeed(true);
      await seedControls.start({
        y: 300,
        opacity: 1,
        transition: { duration: 2, ease: "easeOut" },
      });
    };
    sequence();
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-950 to-sky-900 relative overflow-hidden">
      {/* Robot */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={robotControls}
        className="absolute bottom-20 left-0 w-32 h-32 bg-gray-400 rounded-md shadow-xl"
      >
        <div className="w-full h-full flex items-center justify-center text-white font-bold">
          🤖
        </div>
      </motion.div>

      {/* Raindrop */}
      {showSeed && (
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={seedControls}
          className="absolute top-32 left-1/2 -translate-x-1/2 w-12 h-20 rounded-full backdrop-blur-md bg-white/10 border border-white/30 shadow-md"
        >
          <div className="w-full h-full flex items-center justify-center">
            🌱
          </div>
        </motion.div>
      )}
    </div>
  );
}
