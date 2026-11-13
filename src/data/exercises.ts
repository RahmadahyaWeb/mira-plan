export type MoveKind = 'warmup' | 'cardio' | 'strength' | 'cooldown'

export interface Move {
  id: string
  name: string
  emoji: string
  kind: MoveKind
  /** metabolic equivalent, used for kcal = MET × 3.5 × kg / 200 × minutes */
  met: number
  /** [beginner, active] */
  dose: [string, string]
  minutes: [number, number]
  how: string
}

type Row = [string, string, string, MoveKind, number, [string, string], [number, number], string]

const rows: Row[] = [
  ['march', 'March in Place', '🚶', 'warmup', 3.5, ['3 min', '3 min'], [3, 3], 'Lift your knees to hip height and swing your arms. Easy pace, big smile.'],
  ['arm-circles', 'Arm Circles', '🙆', 'warmup', 2.5, ['1 min each way', '1 min each way'], [2, 2], 'Arms out wide, draw small circles that grow bigger. Switch direction halfway.'],
  ['hip-circles', 'Hip Circles', '🌀', 'warmup', 2.5, ['10 each way', '15 each way'], [2, 2], 'Hands on hips, feet apart. Draw slow circles with your hips.'],
  ['jacks', 'Jumping Jacks', '⭐', 'warmup', 8, ['2 min', '3 min'], [2, 3], 'Jump feet out while arms go up, then back in. Step it out if you need low impact.'],

  ['brisk-walk', 'Brisk Walk', '🚶‍♀️', 'cardio', 4.3, ['20 min', '30 min'], [20, 30], 'Walk fast enough that talking takes a little effort. Outside or on a treadmill.'],
  ['jog', 'Easy Jog', '🏃', 'cardio', 7, ['12 min', '25 min'], [12, 25], 'A relaxed pace you can keep going. Walk breaks are totally fine.'],
  ['cycling', 'Cycling', '🚴', 'cardio', 6.8, ['20 min', '30 min'], [20, 30], 'Bike or stationary bike at a steady, comfy effort.'],
  ['jump-rope', 'Jump Rope', '🪢', 'cardio', 11, ['5 × 1 min', '8 × 1 min'], [7, 11], 'Jump for 1 minute, rest 30 seconds. No rope? Mime it.'],
  ['dance', 'Dance Party', '💃', 'cardio', 6, ['15 min', '20 min'], [15, 20], 'Put on your favorite songs and move nonstop. Silly counts.'],
  ['high-knees', 'High Knees', '🦵', 'cardio', 8, ['4 × 30 s', '6 × 40 s'], [4, 6], 'Run in place driving knees up high. Rest 20 seconds between rounds.'],
  ['stairs', 'Stair Climb', '🪜', 'cardio', 8, ['10 min', '15 min'], [10, 15], 'Walk up and down stairs steadily. Hold the rail if needed.'],
  ['mountain-climbers', 'Mountain Climbers', '⛰️', 'cardio', 8, ['3 × 30 s', '4 × 45 s'], [4, 5], 'From a high plank, drive knees to chest one at a time.'],

  ['squats', 'Bodyweight Squats', '🍑', 'strength', 5, ['3 × 10', '4 × 15'], [6, 8], 'Feet shoulder-width, sit back like into a chair, chest proud, stand tall.'],
  ['pushups', 'Push-Ups', '💪', 'strength', 3.8, ['3 × 6 (knees ok)', '4 × 12'], [5, 7], 'Hands under shoulders, body in a straight line, lower your chest and press up.'],
  ['glute-bridge', 'Glute Bridges', '🌉', 'strength', 3.5, ['3 × 12', '4 × 15'], [5, 6], 'Lie on your back, knees bent. Squeeze your glutes and lift your hips.'],
  ['lunges', 'Reverse Lunges', '🦄', 'strength', 4, ['3 × 8 each leg', '4 × 12 each leg'], [6, 8], 'Step one foot back and lower both knees to 90°. Push back up through the front heel.'],
  ['plank', 'Plank Hold', '🧱', 'strength', 3.8, ['3 × 20 s', '3 × 45 s'], [3, 4], 'Forearms down, body straight from head to heels. Breathe and hold.'],
  ['rows', 'Backpack Rows', '🎒', 'strength', 4, ['3 × 10', '4 × 12'], [5, 7], 'Hinge forward holding a loaded backpack and pull it to your ribs.'],
  ['superman', 'Supermans', '🦸', 'strength', 3, ['3 × 10', '3 × 15'], [4, 5], 'Lie face down and lift arms and legs together. Hold 2 seconds.'],
  ['wall-sit', 'Wall Sit', '🧊', 'strength', 4, ['3 × 20 s', '3 × 45 s'], [3, 4], 'Back flat against a wall, slide down until knees are at 90°. Hold.'],
  ['burpees', 'Burpees', '🔥', 'strength', 8, ['3 × 5', '4 × 10'], [5, 7], 'Squat, hands down, jump feet back, jump feet in, jump up. Step it if you like.'],
  ['bicycle-crunch', 'Bicycle Crunches', '🚲', 'strength', 3.8, ['3 × 12', '4 × 20'], [4, 5], 'Opposite elbow toward opposite knee, slow and controlled.'],
  ['step-ups', 'Step-Ups', '📦', 'strength', 5, ['3 × 10 each leg', '4 × 12 each leg'], [6, 8], 'Step onto a sturdy step or bench, stand tall, step down.'],
  ['dips', 'Chair Dips', '🪑', 'strength', 3.8, ['3 × 8', '4 × 12'], [4, 5], 'Hands on a chair edge behind you, lower your hips and press back up.'],

  ['stretch', 'Full Body Stretch', '🧘', 'cooldown', 2.3, ['5 min', '5 min'], [5, 5], 'Hamstrings, quads, chest and shoulders. Hold each stretch 30 seconds.'],
  ['yoga', 'Gentle Yoga Flow', '🧘‍♀️', 'cooldown', 3, ['8 min', '10 min'], [8, 10], 'Cat-cow, child pose, downward dog and a slow twist. Breathe deep.'],
  ['breathing', 'Calm Breathing', '🌙', 'cooldown', 1.3, ['3 min', '3 min'], [3, 3], 'In for 4, hold for 4, out for 6. Let your shoulders drop.'],
  ['foam-roll', 'Foam Roll', '🌈', 'cooldown', 2.5, ['5 min', '5 min'], [5, 5], 'Roll slowly over calves, thighs and back. Pause on tight spots.'],
]

export const MOVES: Move[] = rows.map(([id, name, emoji, kind, met, dose, minutes, how]) => ({ id, name, emoji, kind, met, dose, minutes, how }))
export const MOVE_BY_ID = Object.fromEntries(MOVES.map((m) => [m.id, m]))
export const movesOf = (kind: MoveKind) => MOVES.filter((m) => m.kind === kind)
