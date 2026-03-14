import { POSITIONS, QUESTIONS, type PositionKey } from '@/data/questions';

export type AnswerMap = Record<string, string>;

export type RankedPosition = {
  key: PositionKey;
  name: string;
  score: number;
  archetype: string;
};

export type AssessmentResult = {
  scores: Record<PositionKey, number>;
  ranking: RankedPosition[];
  primary: RankedPosition | null;
  secondary: RankedPosition | null;
  tertiary: RankedPosition | null;
  strengths: string[];
  watchouts: string[];
  summary: string;
};

const ARCHETYPES: Record<PositionKey, string> = {
  GK: 'Commanding Goalkeeper',
  CB: 'Ball-Playing Defender',
  FB: 'Overlapping Fullback',
  CDM: 'Ball-Winning Midfielder',
  CM: 'Box-to-Box Controller',
  CAM: 'Creative Playmaker',
  WINGER: 'Direct Winger',
  ST: 'Poacher',
};

const POSITION_DETAILS: Record<PositionKey, { strengths: string[]; watchouts: string[] }> = {
  GK: {
    strengths: ['composure', 'responsibility', 'shot-stopping mindset'],
    watchouts: ['distribution under pressure', 'commanding the box'],
  },
  CB: {
    strengths: ['defensive awareness', 'duels', 'protecting team shape'],
    watchouts: ['progressive passing', 'agility against quick forwards'],
  },
  FB: {
    strengths: ['work rate', 'wide defending', 'support runs'],
    watchouts: ['final delivery', 'positioning when attacks break down'],
  },
  CDM: {
    strengths: ['reading danger', 'regaining control', 'linking play'],
    watchouts: ['receiving under pressure', 'switching play quickly'],
  },
  CM: {
    strengths: ['balance', 'tempo control', 'decision-making'],
    watchouts: ['final-third impact', 'assertiveness in duels'],
  },
  CAM: {
    strengths: ['creativity', 'vision', 'advanced playmaking'],
    watchouts: ['defensive work off the ball', 'speed of release'],
  },
  WINGER: {
    strengths: ['direct running', '1v1 confidence', 'wide threat'],
    watchouts: ['decision-making in the final pass', 'tracking runners'],
  },
  ST: {
    strengths: ['movement', 'finishing instinct', 'final actions'],
    watchouts: ['link-up play', 'pressing discipline'],
  },
};

const BASE_SCORES = Object.keys(POSITIONS).reduce((acc, key) => {
  acc[key as PositionKey] = 0;
  return acc;
}, {} as Record<PositionKey, number>);

function findOption(questionId: string, optionId: string) {
  const question = QUESTIONS.find((item) => item.id === questionId);
  if (!question) return null;
  return question.options.find((option) => option.id === optionId) ?? null;
}

function generateSummary(primary: RankedPosition | null, secondary: RankedPosition | null) {
  if (!primary) return 'No result could be generated.';

  const summaries: Record<PositionKey, string> = {
    GK: 'You look most suited to goalkeeping because your answers lean toward responsibility, composure, and protecting the team in high-pressure moments.',
    CB: 'You look most suited to center back because your answers point to defensive awareness, duels, and protecting the team’s shape.',
    FB: 'You look most suited to full back because your answers suggest high work rate, wide defending, and the ability to support both phases of play.',
    CDM: 'You look most suited to defensive midfield because your answers point to reading danger, regaining control, and linking defense with midfield.',
    CM: 'You look most suited to central midfield because your answers suggest balance, game control, support play, and smart decision-making.',
    CAM: 'You look most suited to attacking midfield because your answers show creativity, vision, and an interest in making things happen in advanced areas.',
    WINGER: 'You look most suited to winger because your answers lean toward direct running, 1v1 confidence, and creating danger from wide areas.',
    ST: 'You look most suited to striker because your answers point to movement, final actions, and wanting to finish attacks.',
  };

  const secondaryText = secondary
    ? ` Your secondary fit is ${secondary.name}, which suggests you may also be comfortable in a similar supporting role.`
    : '';

  return `${summaries[primary.key]}${secondaryText}`;
}

export function calculateResult(answers: AnswerMap): AssessmentResult {
  const scores = { ...BASE_SCORES };
  let explicitGkSignals = 0;

  Object.entries(answers ?? {}).forEach(([questionId, optionId]) => {
    const option = findOption(questionId, optionId);
    if (!option) return;

    Object.entries(option.weights).forEach(([position, value]) => {
      scores[position as PositionKey] += value ?? 0;
    });

    if ((option.weights.GK ?? 0) >= 3) {
      explicitGkSignals += 1;
    }
  });

  const sorted: RankedPosition[] = (Object.entries(scores) as [PositionKey, number][])
    .map(([key, score]) => ({
      key,
      name: POSITIONS[key],
      score,
      archetype: ARCHETYPES[key],
    }))
    .sort((a, b) => b.score - a.score);

  const outfieldOnly = sorted.filter((item) => item.key !== 'GK');
  const topOutfield = outfieldOnly[0];

  const filtered = sorted.filter((item) => {
    if (item.key !== 'GK') return true;
    if (explicitGkSignals >= 1) return true;
    return Boolean(topOutfield && item.score >= topOutfield.score - 2);
  });

  const topThree = filtered.slice(0, 3);
  const primary = topThree[0] ?? null;
  const secondary = topThree[1] ?? null;
  const tertiary = topThree[2] ?? null;
  const primaryDetails = primary ? POSITION_DETAILS[primary.key] : null;

  return {
    scores,
    ranking: filtered,
    primary,
    secondary,
    tertiary,
    strengths: primaryDetails?.strengths ?? [],
    watchouts: primaryDetails?.watchouts ?? [],
    summary: generateSummary(primary, secondary),
  };
}

export function formatShareText(result: AssessmentResult) {
  const lines = [
    'Football Position Finder',
    `Primary position: ${result.primary?.name ?? '-'}`,
    `Secondary position: ${result.secondary?.name ?? '-'}`,
    `Archetype: ${result.primary?.archetype ?? '-'}`,
    `Strengths: ${result.strengths.length ? result.strengths.join(', ') : '-'}`,
  ];

  return lines.join('\n');
}
