import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT} from './constants';

type Props = {
  question: string;
  choices: [string, string];
  countdownStart: number; // secondes locales
  countdownEnd: number;
  answer: {
    correct: 0 | 1;
    good: boolean; // vrai = vert, faux = rouge
    headline: string;
    detail: string;
  };
};

const BOX_W = 860;

export const Popup: React.FC<Props> = ({question, choices, countdownStart, countdownEnd, answer}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < countdownStart - 0.1) return null;

  const revealed = t >= countdownEnd;
  const enter = spring({frame: frame - Math.round((countdownStart - 0.1) * fps), fps, config: {damping: 14}});
  const reveal = spring({frame: frame - Math.round(countdownEnd * fps), fps, config: {damping: 12}});
  const n = Math.max(1, Math.ceil(countdownEnd - t));
  const frac = (t - countdownStart) / (countdownEnd - countdownStart);
  const pulse = interpolate((t - countdownStart) % 1, [0, 1], [1.25, 1], {extrapolateLeft: 'clamp'});
  const accent = revealed ? (answer.good ? COLORS.good : COLORS.bad) : '#FACC15';

  return (
    <div
      style={{
        position: 'absolute',
        left: (1080 - BOX_W) / 2,
        top: 700,
        width: BOX_W,
        transform: `scale(${enter})`,
        opacity: Math.min(1, enter),
        background: 'rgba(28,37,65,0.96)',
        border: `6px solid ${accent}`,
        borderRadius: 40,
        padding: '44px 40px',
        fontFamily: FONT,
        color: '#fff',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
      }}
    >
      {!revealed ? (
        <>
          <div style={{fontSize: 68, fontWeight: 900, lineHeight: 1.1}}>{question}</div>
          <div style={{margin: '28px auto', width: 170, height: 170, position: 'relative', transform: `scale(${pulse})`}}>
            <svg width={170} height={170} style={{position: 'absolute', left: 0, top: 0}}>
              <circle cx={85} cy={85} r={74} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={12} />
              <circle
                cx={85}
                cy={85}
                r={74}
                fill="none"
                stroke={accent}
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 74}
                strokeDashoffset={2 * Math.PI * 74 * Math.min(1, Math.max(0, frac))}
                transform="rotate(-90 85 85)"
              />
            </svg>
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110, fontWeight: 900}}>
              {n}
            </div>
          </div>
          <Buttons choices={choices} />
        </>
      ) : (
        <div style={{transform: `scale(${0.8 + 0.2 * reveal})`}}>
          <div style={{fontSize: 96, fontWeight: 900, color: accent, lineHeight: 1}}>{answer.headline}</div>
          <div style={{fontSize: 52, fontWeight: 700, marginTop: 28, lineHeight: 1.25}}>{answer.detail}</div>
          <Buttons choices={choices} correct={answer.correct} />
        </div>
      )}
    </div>
  );
};

const Buttons: React.FC<{choices: [string, string]; correct?: 0 | 1}> = ({choices, correct}) => (
  <div style={{display: 'flex', gap: 28, justifyContent: 'center', marginTop: 24}}>
    {choices.map((c, i) => {
      const isRight = correct === i;
      const dim = correct !== undefined && !isRight;
      return (
        <div
          key={c}
          style={{
            flex: 1,
            padding: '24px 0',
            borderRadius: 24,
            fontSize: 58,
            fontWeight: 900,
            background: isRight ? COLORS.good : 'rgba(255,255,255,0.1)',
            border: '4px solid rgba(255,255,255,0.35)',
            opacity: dim ? 0.35 : 1,
          }}
        >
          {c}
        </div>
      );
    })}
  </div>
);
