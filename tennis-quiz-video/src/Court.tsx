import React from 'react';
import {COLORS, COURT, FONT, toPx} from './constants';

type Props = {laneLine?: boolean};

export const Court: React.FC<Props> = ({laneLine}) => {
  const tl = toPx(0, 0);
  const br = toPx(COURT.width, COURT.length);
  const netL = toPx(-0.4, COURT.length / 2);
  const netR = toPx(COURT.width + 0.4, COURT.length / 2);
  const laneTop = toPx(-0.5, 0);
  const laneBot = toPx(-0.5, COURT.length);
  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      <rect
        x={tl.x}
        y={tl.y}
        width={br.x - tl.x}
        height={br.y - tl.y}
        fill="rgba(255,255,255,0.04)"
        stroke={COLORS.line}
        strokeWidth={6}
      />
      {laneLine && (
        <>
          <line
            x1={laneTop.x}
            y1={laneTop.y}
            x2={laneBot.x}
            y2={laneBot.y}
            stroke={COLORS.muted}
            strokeWidth={4}
            strokeDasharray="14 12"
          />
          <text
            x={laneTop.x - 14}
            y={toPx(0, 2.5).y}
            fill={COLORS.muted}
            fontFamily={FONT}
            fontSize={28}
            fontWeight={700}
            textAnchor="middle"
            transform={`rotate(-90 ${laneTop.x - 14} ${toPx(0, 2.5).y})`}
          >
            LIGNE DE COULOIR
          </text>
        </>
      )}
      <line
        x1={netL.x}
        y1={netL.y}
        x2={netR.x}
        y2={netR.y}
        stroke={COLORS.line}
        strokeWidth={10}
        strokeDasharray="4 8"
      />
      <text
        x={netR.x + 10}
        y={netR.y + 10}
        fill={COLORS.muted}
        fontFamily={FONT}
        fontSize={26}
        fontWeight={700}
      >
        FILET
      </text>
      <text
        x={(tl.x + br.x) / 2}
        y={br.y + 50}
        fill={COLORS.muted}
        fontFamily={FONT}
        fontSize={28}
        fontWeight={600}
        textAnchor="middle"
      >
        {COURT.length} m × {COURT.width} m · Balle Rouge
      </text>
    </svg>
  );
};
