"use client";

import confetti from "canvas-confetti";

export function triggerConfetti() {
  if (typeof window === "undefined") return;
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.6 },
  });
}
