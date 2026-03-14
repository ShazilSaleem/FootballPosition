import { calculateResult, formatShareText } from '@/lib/scoring/calculateResult';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test failed: ${message}`);
  }
}

const strikerAnswers = {
  q2: 'q2_d',
  q4: 'q4_d',
  q6: 'q6_d',
  q8: 'q8_d',
  q10: 'q10_d',
  q11: 'q11_d',
  q12: 'q12_d',
};
const strikerResult = calculateResult(strikerAnswers);
assert(Boolean(strikerResult.primary && strikerResult.primary.key === 'ST'), 'expected striker-heavy answers to rank ST first');
assert(strikerResult.strengths.length > 0, 'expected primary strengths to be populated');

const gkAnswers = {
  q10: 'q10_a',
  q11: 'q11_a',
  q12: 'q12_a',
};
const gkResult = calculateResult(gkAnswers);
assert(gkResult.ranking.some((item) => item.key === 'GK'), 'expected goalkeeper-heavy answers to include GK in ranking');

const wingerAnswers = {
  q1: 'q1_d',
  q3: 'q3_a',
  q7: 'q7_c',
  q9: 'q9_c',
};
const wingerResult = calculateResult(wingerAnswers);
assert(Boolean(wingerResult.primary && wingerResult.primary.key === 'WINGER'), 'expected winger-heavy answers to rank WINGER first');

const emptyResult = calculateResult({});
assert(Array.isArray(emptyResult.ranking), 'expected ranking to be an array for empty answers');
assert(emptyResult.ranking.length > 0, 'expected ranking to still contain default ordered positions');

const shareText = formatShareText(strikerResult);
assert(typeof shareText === 'string', 'expected share text to be a string');
assert(shareText.includes('Primary position: Striker'), 'expected share text to include the primary position');

const invalidAnswerResult = calculateResult({ q1: 'not-real' });
assert(invalidAnswerResult.primary !== null, 'expected invalid answer ids to be ignored without breaking result generation');
