import React from 'react';
import {Sequence} from 'remotion';
import {FPS, T} from './constants';
import {Intro} from './Intro';
import {Outro} from './Outro';
import {Situation} from './Situation';
import {SITUATIONS} from './situations';

const seq = (r: readonly [number, number]) => ({from: r[0] * FPS, durationInFrames: (r[1] - r[0]) * FPS});
const ranges = [T.s1, T.s2, T.s3];

export const Quiz: React.FC = () => (
  <>
    <Sequence {...seq(T.intro)}>
      <Intro />
    </Sequence>
    {SITUATIONS.map((s, i) => (
      <Sequence key={s.index} {...seq(ranges[i])}>
        <Situation {...s} />
      </Sequence>
    ))}
    <Sequence {...seq(T.outro)}>
      <Outro />
    </Sequence>
  </>
);
