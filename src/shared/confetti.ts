import { create as createConfetti } from "canvas-confetti";

export function buildConfetti(x: number, y: number): void {
  const confetti = createConfetti(undefined, { resize: true, useWorker: true });
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { x, y },
  });
}
