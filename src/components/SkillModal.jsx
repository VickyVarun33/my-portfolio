// src/components/SkillModal.jsx
import React from "react";
import { motion } from "framer-motion";

export default function SkillModal({ skill, onClose }) {
  if (!skill) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="relative bg-white rounded-md p-6 w-[min(800px,90%)]"
      >
        <h3 className="text-2xl font-semibold mb-2">{skill.title || "Skill"}</h3>
        <p className="text-gray-700">{skill.description || "Detailed info about this skill / project / experience."}</p>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-sky-600 text-white rounded">Close</button>
        </div>
      </motion.div>
    </div>
  );
}
