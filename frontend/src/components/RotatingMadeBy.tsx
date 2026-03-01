"use client";

import { useEffect, useState } from "react";

const NAMES = ["Ahmad Khan", "Arnav Alok", "Samar", "Arya Gupta"] as const;

export function RotatingMadeBy() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % NAMES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex items-center justify-center gap-1 text-xs text-muted-foreground">
      <span>Made by</span>
      <span className="font-semibold text-primary">{NAMES[index]}</span>
    </span>
  );
}

