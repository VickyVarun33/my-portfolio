// src/tree/TreeMount.jsx
import React, { useEffect, useState } from "react";
import TreeCanvas from "./TreeCanvas";
import SkillModal from "../components/SkillModal";

/**
 * TreeMount listens for DOM events:
 * - 'tree:start' to mount and start drawing the tree
 * - 'tree:nodes' (custom event) carrying JSON detail of nodes:
 *     event.detail = [{id, x, y, title, description}, ...] (x,y in px relative to window)
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
      {/* Node overlays */}
      {nodes.map((n) => (
        <button
          key={n.id}
          onClick={() => setSelected(n)}
          style={{
            position: "fixed",
            left: `${n.x}px`,
            top: `${n.y}px`,
            transform: "translate(-50%,-50%)",
            zIndex: 40,
            pointerEvents: "auto",
            background: "linear-gradient(180deg,#fff,#eee)",
            borderRadius: "999px",
            width: 28,
            height: 28,
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            border: "none",
            cursor: "pointer",
          }}
          title={n.title}
        />
      ))}

      {selected && <SkillModal skill={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
