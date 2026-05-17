import confetti from "canvas-confetti";

export function burstGold() {
  const colors = ["#C8A951", "#F0D080", "#F5F3EE", "#1A1815"];
  void confetti({
    particleCount: 90,
    spread: 72,
    startVelocity: 28,
    origin: { y: 0.72 },
    colors,
    scalar: 0.95,
    ticks: 220,
  });
}
