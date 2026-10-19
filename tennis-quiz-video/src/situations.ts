import {SituationConfig} from './Situation';

export const SITUATIONS: SituationConfig[] = [
  {
    index: 1,
    question: 'FAUTE OU BONNE ?',
    choices: ['FAUTE', 'BONNE'],
    correct: 0,
    good: false,
    headline: 'FAUTE !',
    detail: "Le couloir n'est pas dans le terrain Balle Rouge",
    laneLine: true,
    toi: [3, 10.8],
    lui: [3, 1.2],
    path: {
      start: [3, 1.8],
      t0: 0.4,
      segs: [
        {to: [-0.5, 8.0], dur: 1.6, apex: 1.2, bounce: true},
        {to: [-1.8, 11.5], dur: 0.8, apex: 0.7},
      ],
    },
  },
  {
    index: 2,
    question: 'SERVICE VALIDE ?',
    choices: ['OUI', 'NON'],
    correct: 0,
    good: true,
    headline: 'VALIDE !',
    detail: 'Le service cuillère est autorisé',
    toi: [1.5, 12.7],
    lui: [4.5, 1.2],
    path: {
      start: [1.9, 12.4],
      t0: 0.3,
      segs: [
        {to: [1.9, 12.4], dur: 0.8, apex: 0.8},
        {to: [4.5, 3.5], dur: 1.5, apex: 1.0, bounce: true},
      ],
    },
  },
  {
    index: 3,
    question: 'POINT POUR QUI ?',
    choices: ['TOI', 'LUI'],
    correct: 1,
    good: true,
    headline: 'POINT POUR LUI !',
    detail: '1 seul rebond autorisé',
    numberedBounces: true,
    toi: [1.5, 10.8],
    lui: [3, 1.2],
    path: {
      start: [3, 1.8],
      t0: 0.3,
      segs: [
        {to: [3, 8], dur: 1.2, apex: 1.4, bounce: true},
        {to: [3.6, 10.4], dur: 0.9, apex: 0.8, bounce: true},
        {to: [3.9, 11.6], dur: 0.4, apex: 0.3},
      ],
    },
  },
];
