import { useEffect, useState } from "react";
import { useMotionValue, useTransform, animate } from "framer-motion";

export default function NumberTicker({ value, decimals = 0, suffix = "" }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, v => v.toFixed(decimals));
  const [text, setText] = useState("0");

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.9, ease: "easeOut" });
    const unsub = rounded.on("change", setText);
    return () => { controls.stop(); unsub(); };
  }, [value]);

  return <span className="mono tabular-nums">{text}{suffix}</span>;
}