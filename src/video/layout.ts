export const PROFILE_WIDTH = 1080;
export const PROFILE_HEIGHT = 1920;

export const SAFE_ZONES = {
  horizontal: { left: 72, right: 936, width: 864 },
  vertical: { top: 160, bottom: 1600, height: 1440 },
  headline: { top: 160, bottom: 340, height: 180 },
  chart: { top: 390, bottom: 1160, height: 770, left: 72, right: 936 },
  teaching: { top: 1190, bottom: 1330, height: 140 },
  caption: { top: 1360, bottom: 1510, height: 150 },
  watermark: { top: 1540, bottom: 1600, height: 60 },
};

export interface PriceBox {
  top: number;
  bottom: number;
  min: number;
  max: number;
}

export function priceToY(price: number, box: PriceBox): number {
  if (box.max <= box.min) {
    throw new Error(`Degenerate price range: min=${box.min}, max=${box.max}`);
  }
  if (box.bottom <= box.top) {
    throw new Error(`Degenerate vertical box: top=${box.top}, bottom=${box.bottom}`);
  }

  const fraction = (price - box.min) / (box.max - box.min);
  // Canvas coordinate system: 0 is top, higher price -> smaller Y (closer to box.top)
  return box.bottom - fraction * (box.bottom - box.top);
}

export function computeCandleY(price: number, minPrice: number, maxPrice: number): number {
  return priceToY(price, {
    top: SAFE_ZONES.chart.top + 30, // 30px internal padding
    bottom: SAFE_ZONES.chart.bottom - 30,
    min: minPrice,
    max: maxPrice,
  });
}

