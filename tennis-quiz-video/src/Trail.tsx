import React from 'react';
import {COLORS, FONT, toPx} from './constants';
import {Pt} from './trajectory';

export const Trail: React.FC<{points: Pt[]; bounces: Pt[]; frame: number; numbered?: boolean}> = ({points, bounces, frame, numbered}) => {
  const d = points
    .map((p, i) => {
      const {x, y} = toPx(p[0], p[1]);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      <path d={d} fill="none" stroke={COLORS.ballYellow} strokeWidth={6} strokeLinecap="round" strokeDasharray="1 16" />
      {bounces.map((b, i) => {
        const {x, y} = toPx(b[0], b[1]);
        const r = 14 + ((frame * 0.8 + i * 10) % 24);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={9} fill={COLORS.ballRed} />
            {numbered && (
              <text x={x + 34} y={y + 12} fill="#fff" fontFamily={FONT} fontWeight={900} fontSize={40}>
                {i + 1}
              </text>
            )}
            <circle cx={x} cy={y} r={r} fill="none" stroke={COLORS.ballRed} strokeWidth={3} opacity={0.5} />
          </g>
        );
      })}
    </svg>
  );
};
