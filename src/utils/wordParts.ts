// Splits entries into chunks of whole syllables: "Resonanz" -> Reso, Nanz.
// The syllable rules are a German rule of thumb, they don't know where compounds join.

// Syllables merge until a chunk has at least this many letters. A word too short to
// make two chunks stays whole: "Theater", "Gruppe".
const MIN_CHUNK_LENGTH = 4

// Vowel pairs that stay in one syllable
const DIPHTHONGS = ['au', 'äu', 'ei', 'eu', 'ie', 'ai']
// Consonant groups that start a syllable together, longest first
const ONSETS = [
  'schl', 'schm', 'schn', 'schr', 'schw', 'spr', 'str', 'sch', 'chr',
  'bl', 'br', 'ch', 'ck', 'dr', 'fl', 'fr', 'gl', 'gr', 'kl', 'kn', 'kr',
  'ph', 'pf', 'pl', 'pr', 'qu', 'sp', 'th', 'tr',
]
export const VOWELS = 'aeiouyäöü'

// Small words that can't carry a name on their own
const STOP_WORDS = new Set(['am', 'auf', 'das', 'der', 'die', 'und'])

function isVowelAt(word: string, index: number): boolean {
  const letter = word.charAt(index)
  if (!VOWELS.includes(letter)) return false
  // The u in "qu" belongs to the consonant
  return !(letter === 'u' && word.charAt(index - 1) === 'q')
}

// Where in a run of consonants the next syllable starts
function onsetStart(consonants: string): number {
  if (consonants === '') return 0
  const onset = ONSETS.find((group) => consonants.endsWith(group))
  return consonants.length - (onset?.length ?? 1)
}

function splitSyllables(word: string): string[] {
  const lower = word.toLowerCase()
  const cuts: number[] = []
  let index = 0

  while (index < lower.length) {
    if (!isVowelAt(lower, index)) {
      index++
      continue
    }
    const isDiphthong = DIPHTHONGS.includes(lower.slice(index, index + 2))
    const vowelEnd = index + (isDiphthong ? 2 : 1)

    let next = vowelEnd
    while (next < lower.length && !isVowelAt(lower, next)) next++
    if (next === lower.length) break // the rest belongs to this syllable

    cuts.push(vowelEnd + onsetStart(lower.slice(vowelEnd, next)))
    index = next
  }

  return [0, ...cuts].map((start, i) => word.slice(start, cuts[i]))
}

function mergeShortSyllables(syllables: string[]): string[] {
  const chunks: string[] = []
  let current = ''
  for (const syllable of syllables) {
    current += syllable
    if (current.length >= MIN_CHUNK_LENGTH) {
      chunks.push(current)
      current = ''
    }
  }
  // Leftovers join the last chunk
  if (current !== '') {
    const last = chunks.pop() ?? ''
    chunks.push(last + current)
  }
  return chunks
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function wordsOf(entry: string): string[] {
  return entry
    .trim()
    .split(/\s+/)
    .filter((word) => word !== '' && !STOP_WORDS.has(word.toLowerCase()))
}

function partsOf(entry: string): string[] {
  return wordsOf(entry)
    .flatMap((word) => mergeShortSyllables(splitSyllables(word)))
    .map(capitalize)
}

// The start of a word, cut as soon as it's long enough: "Theater" -> Thea.
// Unlike partsOf, nothing leftover joins it, which keeps it short for blending.
function openingOf(entry: string): string {
  const word = wordsOf(entry)[0]
  if (word === undefined) return ''

  let opening = ''
  for (const syllable of splitSyllables(word)) {
    opening += syllable
    if (opening.length >= MIN_CHUNK_LENGTH) break
  }
  return capitalize(opening)
}

// The opening of every entry, without duplicates
export function firstParts(entries: string[]): string[] {
  const openings = entries.map(openingOf)
  return [...new Set(openings.filter((part) => part !== ''))]
}

// Every chunk of every entry, without duplicates
export function allParts(entries: string[]): string[] {
  return [...new Set(entries.flatMap(partsOf))]
}
