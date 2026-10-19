import React from 'react';
import {COLORS, SCALE, toPx} from './constants';

const R = 24;

export const Ball: React.FC<{x: number; y: number; h: number; spin: number}> = ({x, y, h, spin}) => {
  const ground = toPx(x, y);
  const lift = h * SCALE * 0.55;
  const scale = 1 + h * 0.18;
  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <ellipse
        cx={ground.x}
        cy={ground.y}
        rx={R * (1 - Math.min(h, 2) * 0.15)}
        ry={R * 0.45 * (1 - Math.min(h, 2) * 0.15)}
        fill="rgba(0,0,0,0.45)"
      />
      <g transform={`translate(${ground.x} ${ground.y - lift - R * 0.4}) scale(${scale}) rotate(${spin})`}>
        <path d={`M ${-R} 0 A ${R} ${R} 0 0 1 ${R} 0 Z`} fill={COLORS.ballYellow} />
        <path d={`M ${-R} 0 A ${R} ${R} 0 0 0 ${R} 0 Z`} fill={COLORS.ballRed} />
        <circle r={R} fill="none" stroke="#fff" strokeWidth={2.5} />
      </g>
    </svg>
  );
};
