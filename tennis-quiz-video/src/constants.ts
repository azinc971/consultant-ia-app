export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const COLORS = {
  bg: '#0B132B',
  line: '#FFFFFF',
  toi: '#22C55E',
  lui: '#FFFFFF',
  ballYellow: '#FACC15',
  ballRed: '#EF4444',
  good: '#22C55E',
  bad: '#EF4444',
  panel: '#1C2541',
  muted: '#8B9AB8',
};

export const FONT = 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';

// Terrain Balle Rouge (mètres). ITF/LTA: 11-12 m x 5-6 m (optimal 11 x 5,5). Ici 12 x 6 m.
export const COURT = {length: 12, width: 6};
export const SCALE = 100; // pixels par mètre
export const CENTER = {x: W / 2, y: 1040};

// Coordonnées terrain (x: 0..6 gauche->droite, y: 0..12 haut->bas, filet à y=6) -> pixels
export const toPx = (x: number, y: number) => ({
  x: CENTER.x + (x - COURT.width / 2) * SCALE,
  y: CENTER.y + (y - COURT.length / 2) * SCALE,
});

// Minutage (secondes)
export const T = {
  intro: [0, 3],
  s1: [3, 12],
  s2: [12, 21],
  s3: [21, 30],
  outro: [30, 35],
} as const;
export const TOTAL_FRAMES = 35 * FPS;
