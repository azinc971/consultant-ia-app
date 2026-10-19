export type Pt = [number, number];

export type Seg = {
  to: Pt;
  dur: number; // secondes
  apex: number; // hauteur max (m) pendant ce segment
  bounce?: boolean; // la balle touche le sol à la fin du segment
};

export type BallPath = {start: Pt; t0: number; segs: Seg[]};

export type BallState = {x: number; y: number; h: number; bounces: Pt[]};

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

export const sampleBall = (path: BallPath, t: number): BallState => {
  let from = path.start;
  let start = path.t0;
  const bounces: Pt[] = [];
  for (const seg of path.segs) {
    const end = start + seg.dur;
    if (t < end) {
      const u = Math.max(0, (t - start) / seg.dur);
      return {
        x: lerp(from[0], seg.to[0], u),
        y: lerp(from[1], seg.to[1], u),
        h: 4 * seg.apex * u * (1 - u),
        bounces,
      };
    }
    if (seg.bounce) bounces.push(seg.to);
    from = seg.to;
    start = end;
  }
  return {x: from[0], y: from[1], h: 0, bounces};
};

// Points au sol de la trajectoire jusqu'à t (pour le tracé pointillé)
export const groundTrail = (path: BallPath, t: number, step = 0.03): Pt[] => {
  const pts: Pt[] = [path.start];
  for (let s = path.t0; s <= t; s += step) {
    const b = sampleBall(path, s);
    pts.push([b.x, b.y]);
  }
  const last = sampleBall(path, t);
  pts.push([last.x, last.y]);
  return pts;
};
