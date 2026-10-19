import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Ball} from './Ball';
import {Court} from './Court';
import {COLORS, FONT} from './constants';

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12}});
  const s2 = spring({frame: frame - 12, fps, config: {damping: 12}});
  return (
    <AbsoluteFill style={{background: COLORS.bg, fontFamily: FONT, color: '#fff', textAlign: 'center'}}>
      <div style={{opacity: 0.35}}>
        <Court />
      </div>
      <div style={{position: 'absolute', top: 520, width: '100%', transform: `scale(${s})`}}>
        <div style={{fontSize: 120, fontWeight: 900, lineHeight: 1.05}}>QUIZ TENNIS</div>
        <div style={{fontSize: 120, fontWeight: 900, lineHeight: 1.05, color: COLORS.ballRed}}>BALLE ROUGE</div>
      </div>
      <div style={{position: 'absolute', top: 1000, width: '100%', fontSize: 88, fontWeight: 800, transform: `scale(${s2})`}}>
        3 Situations
      </div>
      <Ball x={3} y={9} h={0.6 + Math.sin(frame / 6) * 0.5} spin={frame * 10} />
    </AbsoluteFill>
  );
};
