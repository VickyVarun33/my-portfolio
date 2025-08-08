// src/TreeMount.jsx
import React, { useEffect, useState } from "react";
import Tree from "./components/Tree";

export default function TreeMount() {
  const [start, setStart] = useState(false);

  useEffect(() => {
    function onStart() {
      setStart(true);
    }
    window.addEventListener("tree:start", onStart);
    return () => window.removeEventListener("tree:start", onStart);
  }, []);

  return <>{start && <Tree start={start} />}</>;
}
