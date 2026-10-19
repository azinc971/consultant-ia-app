import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Ball} from './Ball';
import {Court} from './Court';
import {COLORS, FONT} from './constants';
import {Marker} from './Marker';
import {Popup} from './Popup';
import {Trail} from './Trail';
import {BallPath, groundTrail, sampleBall} from './trajectory';

export type SituationConfig = {
  index: number;
  question: string;
  choices: [string, string];
  correct: 0 | 1;
  good: boolean;
  headline: string;
  detail: string;
  path: BallPath;
  toi: [number, number];
  lui: [number, number];
  laneLine?: boolean;
  numberedBounces?: boolean;
};

// Temps locaux (s) : animation 0-3 | question + décompte 3-6 | réponse 6-9
const COUNT_START = 3;
const COUNT_END = 6;

export const Situation: React.FC<SituationConfig> = (c) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const ball = sampleBall(c.path, t);
  const trail = groundTrail(c.path, t);

  return (
    <AbsoluteFill style={{background: COLORS.bg}}>
      <div style={{position: 'absolute', top: 90, width: '100%', textAlign: 'center', fontFamily: FONT, color: '#fff'}}>
        <div style={{fontSize: 40, fontWeight: 700, color: COLORS.muted, letterSpacing: 4}}>QUIZ TENNIS BALLE ROUGE</div>
        <div style={{fontSize: 110, fontWeight: 900, marginTop: 10}}>SITUATION {c.index}/3</div>
      </div>
      <Court laneLine={c.laneLine} />
      <Trail points={trail} bounces={ball.bounces} frame={frame} numbered={c.numberedBounces} />
      <Marker label="LUI" x={c.lui[0]} y={c.lui[1]} />
      <Marker label="TOI" x={c.toi[0]} y={c.toi[1]} />
      <Ball x={ball.x} y={ball.y} h={ball.h} spin={frame * 14} />
      <Popup
        question={c.question}
        choices={c.choices}
        countdownStart={COUNT_START}
        countdownEnd={COUNT_END}
        answer={{correct: c.correct, good: c.good, headline: c.headline, detail: c.detail}}
      />
    </AbsoluteFill>
  );
};
