import React from 'react';
import {COLORS, FONT, toPx} from './constants';

export const Marker: React.FC<{label: 'TOI' | 'LUI'; x: number; y: number}> = ({label, x, y}) => {
  const p = toPx(x, y);
  const isToi = label === 'TOI';
  const fill = isToi ? COLORS.toi : COLORS.lui;
  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      <circle cx={p.x} cy={p.y} r={44} fill={fill} stroke="#0B132B" strokeWidth={5} />
      <text
        x={p.x}
        y={p.y + 11}
        textAnchor="middle"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={30}
        fill={isToi ? '#fff' : '#0B132B'}
      >
        {label}
      </text>
    </svg>
  );
};
