export interface BlockInstance {
  id: string;
  type: 'move_forward' | 'turn_left' | 'turn_right' | 'repeat' | 'if_path';
  label: string;
  count?: number; // for repeat loop
  children?: BlockInstance[]; // inner blocks inside repeat or if block
}

export interface GameLevel {
  id: number;
  title: string;
  subtitle: string;
  conceptTitle: string;
  conceptDescription: string;
  explanationHindi: string;
  gridSize: { cols: number; rows: number };
  startPos: { x: number; y: number }; // 0-indexed column (x), row (y)
  startDir: 'up' | 'right' | 'down' | 'left';
  goalPos: { x: number; y: number };
  obstacles: { x: number; y: number }[];
  gems?: { x: number; y: number }[];
  allowedBlocks: ('move_forward' | 'turn_left' | 'turn_right' | 'repeat' | 'if_path')[];
  optimalBlockCount: number; // For 3 stars calculation
  hint: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  requiredLevel: number;
}

export const GAME_BADGES: BadgeItem[] = [
  {
    id: 'code_novice',
    title: 'Code Novice',
    description: 'Completed your very first coding challenge!',
    icon: 'emoji_events',
    color: 'from-amber-400 to-amber-600',
    requiredLevel: 1,
  },
  {
    id: 'sequence_master',
    title: 'Sequence Specialist',
    description: 'Mastered step-by-step command execution in Levels 1-3.',
    icon: 'alt_route',
    color: 'from-blue-400 to-indigo-600',
    requiredLevel: 3,
  },
  {
    id: 'loop_master',
    title: 'Loop Master',
    description: 'Unlocked the power of Repeat blocks to write clean code!',
    icon: 'published_with_changes',
    color: 'from-purple-400 to-fuchsia-600',
    requiredLevel: 5,
  },
  {
    id: 'logic_wizard',
    title: 'Logic Wizard',
    description: 'Guided Frandy using If/Else conditional decision making.',
    icon: 'psychology',
    color: 'from-emerald-400 to-teal-600',
    requiredLevel: 7,
  },
  {
    id: 'gem_collector',
    title: 'Gem Collector',
    description: 'Gathered all energy gems while solving the maze.',
    icon: 'diamond',
    color: 'from-rose-400 to-pink-600',
    requiredLevel: 8,
  },
  {
    id: 'grand_master',
    title: 'Grand Algorithm Champion',
    description: 'Conquered all 10 levels with top efficiency!',
    icon: 'workspace_premium',
    color: 'from-amber-300 via-rose-500 to-indigo-600',
    requiredLevel: 10,
  },
];

export const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    title: 'Level 1: First Steps',
    subtitle: 'Sequencing Basics',
    conceptTitle: 'Algorithms & Sequence (Kramsh Execution)',
    conceptDescription:
      'Computer algorithms run commands step-by-step in exact order. Add Move Forward blocks to reach the energy star!',
    explanationHindi:
      'Aapne seekha ki computer har instruction ko line-by-line order mein execute karta hai. Sahi order hi algorithm banata hai!',
    gridSize: { cols: 5, rows: 5 },
    startPos: { x: 1, y: 2 },
    startDir: 'right',
    goalPos: { x: 3, y: 2 },
    obstacles: [],
    allowedBlocks: ['move_forward'],
    optimalBlockCount: 2,
    hint: 'Add 2 "Move Forward" blocks to move Frandy 2 steps right to the goal!',
  },
  {
    id: 2,
    title: 'Level 2: Turning Point',
    subtitle: 'Directional Navigation',
    conceptTitle: 'Direction Commands & Rotation',
    conceptDescription:
      'Sometimes the path is not a straight line! Combine Move Forward with Turn Left or Turn Right to navigate around barriers.',
    explanationHindi:
      'Programs mein direction change karna zaroori hota hai. Turn blocks Frandy ki orientation ko 90 degrees rotate karte hain!',
    gridSize: { cols: 5, rows: 5 },
    startPos: { x: 1, y: 1 },
    startDir: 'right',
    goalPos: { x: 3, y: 3 },
    obstacles: [
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
    allowedBlocks: ['move_forward', 'turn_left', 'turn_right'],
    optimalBlockCount: 6,
    hint: 'Move forward once, turn right, move down twice, turn left, and move forward!',
  },
  {
    id: 3,
    title: 'Level 3: Zig-Zag Pathway',
    subtitle: 'Multi-Turn Challenge',
    conceptTitle: 'Complex Command Sequencing',
    conceptDescription:
      'Guide Frandy through a winding corridor! Pay close attention to which direction Frandy is facing before each turn.',
    explanationHindi:
      'Complex problems ko chhote-chhote steps mein break karna hi computational thinking hai!',
    gridSize: { cols: 5, rows: 5 },
    startPos: { x: 0, y: 0 },
    startDir: 'down',
    goalPos: { x: 4, y: 4 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
    ],
    allowedBlocks: ['move_forward', 'turn_left', 'turn_right'],
    optimalBlockCount: 10,
    hint: 'Move down, turn left, move right, turn right, move down, turn left, and move right to the goal!',
  },
  {
    id: 4,
    title: 'Level 4: Loop Invention',
    subtitle: 'The Power of Repeat',
    conceptTitle: 'Loops & DRY Principle (Don\'t Repeat Yourself)',
    conceptDescription:
      'Instead of adding 5 Move Forward blocks, use a single Repeat 5 Times block! Loops make code shorter and more powerful.',
    explanationHindi:
      'Loops se aap same code ko multiple times run kar sakte hain bina baar baar type kiye. Yeh programming ka core building block hai!',
    gridSize: { cols: 6, rows: 6 },
    startPos: { x: 0, y: 2 },
    startDir: 'right',
    goalPos: { x: 5, y: 2 },
    obstacles: [],
    allowedBlocks: ['move_forward', 'repeat'],
    optimalBlockCount: 2,
    hint: 'Place a "Repeat 5 Times" block and put 1 "Move Forward" block inside it!',
  },
  {
    id: 5,
    title: 'Level 5: Patrol Square',
    subtitle: 'Pattern Recognition',
    conceptTitle: 'Pattern Recognition in Loops',
    conceptDescription:
      'Moving around a square means doing the same pattern (Move 2 steps, Turn Right) four times in a row. Put that inside a Repeat 4 loop!',
    explanationHindi:
      'Patterns pehchan ke unhe loop mein daalna software optimization ka tarika hai!',
    gridSize: { cols: 5, rows: 5 },
    startPos: { x: 1, y: 1 },
    startDir: 'right',
    goalPos: { x: 1, y: 3 },
    obstacles: [{ x: 2, y: 2 }],
    allowedBlocks: ['move_forward', 'turn_right', 'repeat'],
    optimalBlockCount: 3,
    hint: 'Use Repeat 3 Times with [Move Forward 2 times, Turn Right] inside!',
  },
  {
    id: 6,
    title: 'Level 6: Staircase Ascent',
    subtitle: 'Nested Step Sequences',
    conceptTitle: 'Looping Complex Sequences',
    conceptDescription:
      'Climb the stair steps to reach the top right portal! Find the repeated step-up sequence and put it inside a Loop.',
    explanationHindi:
      'Loop ke andar sirf ek block nahi, balki Poora Action Sequence (Move + Turn + Move + Turn) rakha ja sakta hai!',
    gridSize: { cols: 6, rows: 6 },
    startPos: { x: 0, y: 5 },
    startDir: 'right',
    goalPos: { x: 4, y: 1 },
    obstacles: [
      { x: 1, y: 5 },
      { x: 2, y: 4 },
      { x: 3, y: 3 },
      { x: 4, y: 2 },
    ],
    allowedBlocks: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
    optimalBlockCount: 5,
    hint: 'Repeat 4 times: [Move Forward, Turn Left, Move Forward, Turn Right]!',
  },
  {
    id: 7,
    title: 'Level 7: Smart Rover',
    subtitle: 'Conditional Logic',
    conceptTitle: 'If/Else Conditionals (Decision Making)',
    conceptDescription:
      'If/Else blocks allow programs to make dynamic decisions! Use "If Path Ahead" so Frandy moves forward when clear and turns when hitting a wall.',
    explanationHindi:
      'Conditionals computer ko decision-making power dete hain. "AGAR rasta saaf hai -> AAGE BADHO, WARNA -> TURN KARO"!',
    gridSize: { cols: 6, rows: 6 },
    startPos: { x: 0, y: 1 },
    startDir: 'right',
    goalPos: { x: 5, y: 4 },
    obstacles: [
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 1, y: 4 },
    ],
    allowedBlocks: ['move_forward', 'turn_right', 'turn_left', 'repeat', 'if_path'],
    optimalBlockCount: 4,
    hint: 'Put an "If Path Ahead" inside a Loop! If true: Move Forward, Else: Turn Right.',
  },
  {
    id: 8,
    title: 'Level 8: Energy Gem Run',
    subtitle: 'Multiple Objectives & State',
    conceptTitle: 'Variables & Objectives (State Management)',
    conceptDescription:
      'Collect both glowing Energy Gems on your way to the portal! Programs often track variables and state before reaching the final output.',
    explanationHindi:
      'Computer programs mein variables aur state track karna hota hai — jaise game mein score aur collected items!',
    gridSize: { cols: 6, rows: 6 },
    startPos: { x: 0, y: 0 },
    startDir: 'right',
    goalPos: { x: 5, y: 5 },
    obstacles: [
      { x: 2, y: 1 },
      { x: 3, y: 3 },
      { x: 1, y: 4 },
    ],
    gems: [
      { x: 3, y: 0 },
      { x: 3, y: 5 },
    ],
    allowedBlocks: ['move_forward', 'turn_right', 'turn_left', 'repeat', 'if_path'],
    optimalBlockCount: 7,
    hint: 'Navigate to collect the first gem at (3,0), turn down to collect the second at (3,5), then reach the goal!',
  },
  {
    id: 9,
    title: 'Level 9: Labyrinth Optimizer',
    subtitle: 'Code Efficiency Challenge',
    conceptTitle: 'Algorithm Efficiency (Time & Space Complexity)',
    conceptDescription:
      'Any code can solve a problem, but great software engineers write code that uses minimal instructions and memory.',
    explanationHindi:
      'Kam blocks mein same solution nikalna hi Code Efficiency aur Optimization hai!',
    gridSize: { cols: 7, rows: 7 },
    startPos: { x: 0, y: 3 },
    startDir: 'right',
    goalPos: { x: 6, y: 3 },
    obstacles: [
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
      { x: 4, y: 5 },
    ],
    gems: [{ x: 3, y: 0 }],
    allowedBlocks: ['move_forward', 'turn_left', 'turn_right', 'repeat', 'if_path'],
    optimalBlockCount: 8,
    hint: 'Use Loops to sweep around the vertical wall barriers in fewer block lines!',
  },
  {
    id: 10,
    title: 'Level 10: Grand Master Maze',
    subtitle: 'Ultimate Mastery',
    conceptTitle: 'Full Algorithm Mastery (Sequence + Loop + Condition)',
    conceptDescription:
      'Combine everything you learned: Sequencing, Loops, and Conditionals to solve this ultimate maze and earn the Grand Master badge!',
    explanationHindi:
      'Congratulations! Aapne Real Programming ke teeno pillar (Sequence, Loop, Condition) master kar liye hain!',
    gridSize: { cols: 7, rows: 7 },
    startPos: { x: 0, y: 0 },
    startDir: 'down',
    goalPos: { x: 6, y: 6 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 5, y: 4 },
      { x: 5, y: 5 },
    ],
    gems: [
      { x: 0, y: 6 },
      { x: 6, y: 0 },
    ],
    allowedBlocks: ['move_forward', 'turn_left', 'turn_right', 'repeat', 'if_path'],
    optimalBlockCount: 9,
    hint: 'Use a master Loop with nested If Path Ahead logic to conquer the labyrinth!',
  },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Aarav Sharma', studentId: 'CS_AARAV', stars: 30, xp: 1850, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' },
  { rank: 2, name: 'Priya Verma', studentId: 'CS_PRIYA', stars: 29, xp: 1720, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
  { rank: 3, name: 'Rohan Gupta', studentId: 'CS_ROHAN', stars: 28, xp: 1650, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80' },
  { rank: 4, name: 'Sneha Patel', studentId: 'CS_SNEHA', stars: 26, xp: 1510, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80' },
  { rank: 5, name: 'Devansh Kumar', studentId: 'CS_DEV', stars: 24, xp: 1400, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
];
