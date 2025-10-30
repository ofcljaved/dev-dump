interface Color {
  h: number;
  s: number;
  l: number;
}

export interface Plus {
  x: number;
  y: number;
  size: number;
  baseOpac: number;
  currOpac: number;
  baseRotate: number;
  currRotate: number;
  baseColor: Color;
  currColor: Color;
}

export interface DrawPlus extends Plus {
  ctx: CanvasRenderingContext2D;
}
