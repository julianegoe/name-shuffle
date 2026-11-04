// Makes new words out of two pieces and rates how good they sound.

import { capitalize, VOWELS } from '@/utils/wordParts'

// Endings that sound like a name or a concept: "Konfrontanz", "Ensemtik"
const STRONG_ENDINGS = ['anz', 'enz', 'ik', 'ix', 'ax', 'um', 'ale', 'ore', 'ion', 'ant', 'ent', 'ude', 'era', 'ika', 'ur', 'all']

const IDEAL_LENGTH_MIN = 7
const IDEAL_LENGTH_MAX = 10

function isVowel(letter: string): boolean {
  return letter !== '' && VOWELS.includes(letter)
}

// Joins the pieces, smoothing only where they meet: Konfron + Nanz -> Konfronanz,
// Thea + Ampli -> Theampli, Stabi + Ampli -> Stabampli, Kollek + Nanz -> Kolleknanz.
export function blendName(first: string, second: string): string {
  const start = first.toLowerCase()
  const end = second.toLowerCase()
  return capitalize(start.slice(0, joinPoint(start, end)) + end)
}

// How much of `start` to keep in front of `end`
function joinPoint(start: string, end: string): number {
  // Shared letters at the join count once, and then the join already flows
  for (let size = Math.min(3, start.length, end.length); size >= 1; size--) {
    if (start.endsWith(end.slice(0, size))) return start.length - size
  }

  // Two vowels in a row stumble, so the first one goes
  const twoVowels =
    isVowel(end.charAt(0)) && isVowel(start.charAt(start.length - 1));
  return twoVowels && start.length > 2 ? start.length - 1 : start.length;
}

function longestConsonantRun(word: string): number {
  const runs = word.split(new RegExp(`[${VOWELS}]+`))
  return Math.max(...runs.map((run) => run.length))
}

function scoreName(name: string): number {
  const lower = name.toLowerCase()
  let score = 0

  if (lower.length >= IDEAL_LENGTH_MIN && lower.length <= IDEAL_LENGTH_MAX) score += 3
  score -= Math.max(0, lower.length - IDEAL_LENGTH_MAX)
  score -= Math.max(0, IDEAL_LENGTH_MIN - lower.length)

  if (STRONG_ENDINGS.some((ending) => lower.endsWith(ending))) score += 2
  // A weak -e/-er ending fades out
  if (lower.endsWith('er') || lower.endsWith('e')) score -= 1

  const run = longestConsonantRun(lower)
  if (run >= 3) score -= (run - 2) * 2
  // The same letter three times in a row
  if (/(.)\1\1/.test(lower)) score -= 4

  return score
}

// The pieces that make the best new word with `other`, best first.
// `taken` holds existing words in lower case: a blend that just rebuilds one isn't new.
export function bestPartners(
  other: string,
  pieces: string[],
  otherIsFirst: boolean,
  taken: Set<string>,
  count = 10,
): string[] {
  return pieces
    .filter((piece) => piece.toLowerCase() !== other.toLowerCase())
    .map((piece) => {
      const name = otherIsFirst ? blendName(other, piece) : blendName(piece, other)
      return { piece, score: taken.has(name.toLowerCase()) ? -100 : scoreName(name) }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ piece }) => piece)
}
