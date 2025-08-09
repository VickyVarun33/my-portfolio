import React, { useEffect, useState } from "react";
import TreeCanvas from "./TreeCanvas";
import SkillModal from "../components/SkillModal";

/**
 * Listens for window events:
 * - 'tree:start' to mount TreeCanvas
 * - 'tree:nodes' to receive branch node positions and metadata
 */
export default function TreeMount() {
  const [started, setStarted] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    function onStart() {
      setStarted(true);
    }
    function onNodes(e) {
      if (e?.detail) setNodes(e.detail);
    }
    window.addEventListener("tree:start", onStart);
    window.addEventListener("tree:nodes", onNodes);
    return () => {
      window.removeEventListener("tree:start", onStart);
      window.removeEventListener("tree:nodes", onNodes);
    };
  }, []);

  return (
    <>
      {started && <TreeCanvas />}
      {nodes.map((n) => (
        <button
          key={n.id}
          onClick={() => setSelected(n)}
          className="skill-node"
          style={{
            position: "fixed",
            left: `${n.x}px`,
            top: `${n.y}px`,
            transform: "translate(-50%,-50%)",
            zIndex: 40,
            width: 28,
            height: 28,
            borderRadius: 28,
            background: "linear-gradient(180deg,#fff,#e6e6e6)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
            border: "none",
            cursor: "pointer",
            pointerEvents: "auto"
          }}
          title={n.title}
        />
      ))}
      {selected && <SkillModal skill={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
