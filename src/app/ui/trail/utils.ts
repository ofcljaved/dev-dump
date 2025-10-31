export const PLUS_CONSTANTS = {
  SIZE: 15,
  SPACING_MULTIPLIER: 3,
  MIN_OPACITY: 0.3,
  MAX_OPACITY: 0.55,
  MAX_GRADE: 5,
  MIN_LIGHT: 20,
  MAX_LIGHT: 30,
  HOVER_RADIUS_MULTIPLIER: 2,
  FADE_IN_SPEED: 0.2,
  FADE_OUT_SPEED: 0.009,
  COLOR_LERP_SPEED: 0.02,
  ROTATE_LERP_SPEED: 0.05,
  IDLE_TIMEOUT: 500,
  KICK_FRAMES: 3,
};

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function seed(i: number, j: number): number {
  return Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
}

export function seededRandom(i: number, j: number): number {
  const rand = seed(i, j);
  return rand - Math.floor(rand);
}
