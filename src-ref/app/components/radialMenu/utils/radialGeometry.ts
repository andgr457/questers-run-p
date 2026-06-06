export function getRadialPosition(
  i: number,
  total: number,
  radius: number
) {
  const safeTotal = Math.max(total, 1)

  const spread = Math.min(
    Math.PI * 1.2,
    Math.PI * 0.35 * safeTotal
  )

  const start = 1 + i

  const angle =
    safeTotal === 1
      ? 0
      : start + (i / (safeTotal - 1)) * spread
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}
export function getRadialPositionVertical(
  i: number,
  parentSize: number,
  itemSize: number,
  gap = 10
) {
  return {
    x: (parentSize - itemSize) / 2,
    y: parentSize / 2 - (i + 1) * (itemSize + gap),
  }
}