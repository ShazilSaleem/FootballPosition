export type PositionKey = 'GK' | 'CB' | 'FB' | 'CDM' | 'CM' | 'CAM' | 'WINGER' | 'ST';

export type QuestionOption = {
  id: string;
  label: string;
  weights: Partial<Record<PositionKey, number>>;
};

export type Question = {
  id: string;
  title: string;
  options: QuestionOption[];
};

export const POSITIONS: Record<PositionKey, string> = {
  GK: 'Goalkeeper',
  CB: 'Center Back',
  FB: 'Full Back',
  CDM: 'Defensive Midfielder',
  CM: 'Central Midfielder',
  CAM: 'Attacking Midfielder',
  WINGER: 'Winger',
  ST: 'Striker',
};

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    title: 'When you receive the ball with an opponent closing you down, what do you usually do?',
    options: [
      { id: 'q1_a', label: 'Pass quickly and keep the move flowing', weights: { CM: 3, CDM: 3, CAM: 1 } },
      { id: 'q1_b', label: 'Turn and drive forward into space', weights: { WINGER: 3, CAM: 2, ST: 1 } },
      { id: 'q1_c', label: 'Shield the ball and wait for support', weights: { CDM: 2, CB: 2, ST: 1 } },
      { id: 'q1_d', label: 'Try to beat the defender 1v1', weights: { WINGER: 4, CAM: 1, FB: 1 } },
    ],
  },
  {
    id: 'q2',
    title: 'What part of the game do you enjoy most?',
    options: [
      { id: 'q2_a', label: 'Stopping attacks and winning the ball back', weights: { CB: 3, CDM: 3, FB: 1 } },
      { id: 'q2_b', label: 'Controlling the tempo and linking play', weights: { CM: 4, CDM: 2, CAM: 1 } },
      { id: 'q2_c', label: 'Creating chances for others', weights: { CAM: 4, WINGER: 2, CM: 1 } },
      { id: 'q2_d', label: 'Scoring goals and attacking the box', weights: { ST: 4, WINGER: 1, CAM: 1 } },
    ],
  },
  {
    id: 'q3',
    title: 'Which description fits you best physically?',
    options: [
      { id: 'q3_a', label: 'Quick over short distances and hard to catch', weights: { WINGER: 4, FB: 2, ST: 1 } },
      { id: 'q3_b', label: 'Strong in duels and hard to move off the ball', weights: { CB: 4, CDM: 2, ST: 1 } },
      { id: 'q3_c', label: 'High stamina and able to run all game', weights: { FB: 4, CM: 2, WINGER: 1 } },
      { id: 'q3_d', label: 'Not the most athletic, but calm and technically secure', weights: { CM: 2, CAM: 2, CDM: 1, GK: 1 } },
    ],
  },
  {
    id: 'q4',
    title: 'When your team loses the ball, what is your first instinct?',
    options: [
      { id: 'q4_a', label: 'Press immediately and try to win it back', weights: { CDM: 3, CM: 2, WINGER: 1, ST: 1 } },
      { id: 'q4_b', label: 'Drop back and protect the shape', weights: { CB: 3, FB: 2, CDM: 2 } },
      { id: 'q4_c', label: 'Track the nearest dangerous runner', weights: { FB: 3, CM: 2, CB: 1 } },
      { id: 'q4_d', label: 'Stay high and be ready for the counterattack', weights: { ST: 4, WINGER: 2 } },
    ],
  },
  {
    id: 'q5',
    title: 'In a match, teammates rely on you mostly for:',
    options: [
      { id: 'q5_a', label: 'Defensive solidity and winning duels', weights: { CB: 4, CDM: 2, FB: 1 } },
      { id: 'q5_b', label: 'Energy, support runs, and covering space', weights: { FB: 3, CM: 3, WINGER: 1 } },
      { id: 'q5_c', label: 'Creativity, vision, and passing ideas', weights: { CAM: 4, CM: 2, WINGER: 1 } },
      { id: 'q5_d', label: 'Goals, final actions, and direct threat', weights: { ST: 4, WINGER: 2, CAM: 1 } },
    ],
  },
  {
    id: 'q6',
    title: 'Which statement sounds most like your style?',
    options: [
      { id: 'q6_a', label: 'I read the game well and break up play', weights: { CDM: 4, CB: 2, CM: 1 } },
      { id: 'q6_b', label: 'I like carrying the ball into open space', weights: { WINGER: 3, CM: 2, FB: 1 } },
      { id: 'q6_c', label: 'I like receiving between the lines and creating', weights: { CAM: 4, CM: 1, ST: 1 } },
      { id: 'q6_d', label: 'I like timing runs and getting on the end of moves', weights: { ST: 4, WINGER: 1, CAM: 1 } },
    ],
  },
  {
    id: 'q7',
    title: 'In wide areas, you are most comfortable:',
    options: [
      { id: 'q7_a', label: 'Defending 1v1s and blocking crosses', weights: { FB: 4, CB: 1 } },
      { id: 'q7_b', label: 'Overlapping and delivering crosses', weights: { FB: 4, WINGER: 1 } },
      { id: 'q7_c', label: 'Cutting inside to create or shoot', weights: { WINGER: 4, CAM: 2, ST: 1 } },
      { id: 'q7_d', label: 'I prefer staying central rather than going wide', weights: { CB: 1, CDM: 2, CM: 2, CAM: 1, ST: 1 } },
    ],
  },
  {
    id: 'q8',
    title: 'Which strength best describes you?',
    options: [
      { id: 'q8_a', label: 'Composure under pressure', weights: { CM: 3, CDM: 2, GK: 2, CB: 1 } },
      { id: 'q8_b', label: 'Vision and spotting passes early', weights: { CAM: 4, CM: 3, CDM: 1 } },
      { id: 'q8_c', label: 'Stamina and repeat runs', weights: { FB: 4, CM: 2, WINGER: 2 } },
      { id: 'q8_d', label: 'Finishing and staying calm near goal', weights: { ST: 4, CAM: 1, WINGER: 1 } },
    ],
  },
  {
    id: 'q9',
    title: 'How do you usually help your team in attack?',
    options: [
      { id: 'q9_a', label: 'By supporting buildup and recycling possession', weights: { CDM: 3, CM: 3, CB: 1 } },
      { id: 'q9_b', label: 'By making late runs into dangerous areas', weights: { CM: 2, CAM: 2, ST: 2 } },
      { id: 'q9_c', label: 'By beating defenders out wide', weights: { WINGER: 4, FB: 1 } },
      { id: 'q9_d', label: 'By attacking the box and finishing moves', weights: { ST: 4, CAM: 1 } },
    ],
  },
  {
    id: 'q10',
    title: 'Which statement feels most true?',
    options: [
      { id: 'q10_a', label: 'I organize others and stay switched on defensively', weights: { CB: 3, GK: 3, CDM: 1 } },
      { id: 'q10_b', label: 'I connect defense and attack', weights: { CDM: 3, CM: 3, FB: 1 } },
      { id: 'q10_c', label: 'I create danger in the final third', weights: { CAM: 3, WINGER: 2, ST: 1 } },
      { id: 'q10_d', label: 'I live for scoring chances', weights: { ST: 4, WINGER: 1 } },
    ],
  },
  {
    id: 'q11',
    title: 'What type of responsibility do you naturally enjoy?',
    options: [
      { id: 'q11_a', label: 'Protecting the goal and making crucial stops', weights: { GK: 5, CB: 1 } },
      { id: 'q11_b', label: 'Winning duels and keeping attackers quiet', weights: { CB: 4, FB: 2, CDM: 1 } },
      { id: 'q11_c', label: 'Helping the team move and control the game', weights: { CM: 4, CDM: 2, CAM: 1 } },
      { id: 'q11_d', label: 'Being the main threat near goal', weights: { ST: 4, WINGER: 1, CAM: 1 } },
    ],
  },
  {
    id: 'q12',
    title: 'Which match moment suits you best?',
    options: [
      { id: 'q12_a', label: 'A one-on-one save or claiming a dangerous ball', weights: { GK: 5 } },
      { id: 'q12_b', label: 'A big tackle or interception to stop an attack', weights: { CB: 3, CDM: 3, FB: 1 } },
      { id: 'q12_c', label: 'A line-breaking pass or creative final ball', weights: { CAM: 4, CM: 2, CDM: 1 } },
      { id: 'q12_d', label: 'A smart run and clean finish', weights: { ST: 4, WINGER: 1 } },
    ],
  },
];
