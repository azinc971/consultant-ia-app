import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from './constants';

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12}});
  const s2 = spring({frame: frame - 30, fps, config: {damping: 12}});
  return (
    <AbsoluteFill style={{background: COLORS.bg, fontFamily: FONT, color: '#fff', textAlign: 'center'}}>
      <div style={{position: 'absolute', top: 360, width: '100%', fontSize: 80, fontWeight: 800, color: COLORS.muted}}>
        TON SCORE
      </div>
      <div style={{position: 'absolute', top: 480, width: '100%', fontSize: 380, fontWeight: 900, transform: `scale(${s})`}}>
        <span style={{color: COLORS.muted}}>?</span>
        <span style={{color: COLORS.ballYellow}}>/3</span>
      </div>
      <div style={{position: 'absolute', top: 1000, width: '100%', fontSize: 56, fontWeight: 700, color: COLORS.muted}}>
        Dis-le en commentaire 👇
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1260,
          left: 90,
          right: 90,
          padding: '48px 30px',
          borderRadius: 40,
          background: COLORS.ballRed,
          fontSize: 76,
          fontWeight: 900,
          lineHeight: 1.15,
          transform: `scale(${s2})`,
        }}
      >
        Abonne-toi pour d'autres astuces Tennis !
      </div>
    </AbsoluteFill>
  );
};
