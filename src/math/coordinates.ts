/**
 * Mathematical transformations between (Price, Time/Index) and Canvas (X, Y) Coordinates
 */

export interface ViewportBounds {
  minPrice: number;
  maxPrice: number;
  startIndex: number;
  endIndex: number;
}

/**
 * Calculates Y pixel coordinate on Canvas.
 * Note: Canvas Y=0 is TOP, while highest price is at top!
 */
export function priceToCanvasY(
  price: number,
  minPrice: number,
  maxPrice: number,
  canvasHeight: number,
  padding: number = 40
): number {
  const range = maxPrice - minPrice;
  if (range <= 0) return canvasHeight / 2;

  const drawableHeight = canvasHeight - padding * 2;
  // Normalized 0 at minPrice, 1 at maxPrice
  const normalized = (price - minPrice) / range;
  // Invert because higher price is closer to Y = 0
  return canvasHeight - padding - normalized * drawableHeight;
}

/**
 * Converts index to X pixel coordinate on Canvas
 */
export function indexToCanvasX(
  index: number,
  candleWidth: number,
  candleGap: number,
  scrollOffsetX: number = 60
): number {
  return scrollOffsetX + index * (candleWidth + candleGap);
}
