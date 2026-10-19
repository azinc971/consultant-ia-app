import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, TOTAL_FRAMES, W} from './constants';
import {Quiz} from './Quiz';

export const Root: React.FC = () => (
  <Composition id="TennisQuiz" component={Quiz} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
