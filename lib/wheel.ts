import type { Participant } from "@/types/roulette";

export function getWheelColor(index: number, total: number): string {
  const hue = (index * 137.508 + total * 11) % 360;
  const saturation = 72 + ((index + total) % 3) * 7;
  const lightness = 62 + (index % 2) * 8;

  return `hsl(${hue.toFixed(2)} ${saturation}% ${lightness}%)`;
}

function roundSvgNumber(value: number): number {
  return Number(value.toFixed(4));
}

export function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: roundSvgNumber(cx + radius * Math.cos(radians)),
    y: roundSvgNumber(cy + radius * Math.sin(radians))
  };
}

export function describeSector(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, "Z"].join(" ");
}

export function getSectorCenterAngle(index: number, total: number): number {
  return (360 / total) * index + 180 / total;
}

export function getTargetRotation(winnerIndex: number, participants: Participant[], rounds: number, targetAngleOffset = 0): number {
  const centerAngle = getSectorCenterAngle(winnerIndex, participants.length);
  const pointerAngle = 90;
  const targetOffset = ((pointerAngle - (centerAngle + targetAngleOffset)) + 360) % 360;

  return rounds * 360 + targetOffset;
}

export function getSpinDelta(
  currentRotation: number,
  winnerIndex: number,
  participants: Participant[],
  rounds: number,
  targetAngleOffset = 0
): number {
  const targetRotation = getTargetRotation(winnerIndex, participants, rounds, targetAngleOffset);
  const currentOffset = ((currentRotation % 360) + 360) % 360;
  const targetOffset = ((targetRotation % 360) + 360) % 360;
  const adjustment = ((targetOffset - currentOffset) + 360) % 360;

  return rounds * 360 + adjustment;
}
