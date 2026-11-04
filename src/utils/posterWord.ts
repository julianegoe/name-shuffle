const TEXT_WIDTH = 344 // of the posters' 400 wide viewBox
const MAX_FONT_SIZE = 130
const LETTER_WIDTH = 0.72 // average width of a Russo One capital, in em
const CAP_HEIGHT = 0.72 // height of a Russo One capital, in em
const LINE_GAP = 12

// Two-word names: each word grows until it fills the text width or hits its max.
function fitSize(word: string, letterWidth: number, max: number): number {
  return Math.min(max, TEXT_WIDTH / (letterWidth * Math.max(word.length, 1)))
}
export const fitPrefix = (word: string, max: number) => fitSize(word, 0.66, max) // Russo One, faux bold
export const fitMainWord = (word: string, max: number) => fitSize(word, 0.62, max) // Russo One

// A word on its own gets broken in two, so it can be as big as possible: RESO / NANZ.
// Multiple words break at the space; words of up to 4 letters stay on one line.
function splitWord(word: string): string[] {
  const upper = word.toUpperCase()
  const space = upper.indexOf(' ')
  if (space !== -1) return [upper.slice(0, space), upper.slice(space + 1)]
  if (upper.length <= 4) return [upper]
  const middle = Math.ceil(upper.length / 2)
  return [upper.slice(0, middle), upper.slice(middle)]
}

export function soloWordLayout(word: string) {
  const lines = splitWord(word)
  const longest = Math.max(...lines.map((line) => line.length), 1)
  const fontSize = Math.min(MAX_FONT_SIZE, TEXT_WIDTH / (LETTER_WIDTH * longest))
  const capHeight = CAP_HEIGHT * fontSize
  const lineStep = capHeight + LINE_GAP
  const height = capHeight + lineStep * (lines.length - 1)

  return { lines, fontSize, capHeight, lineStep, height, textWidth: TEXT_WIDTH }
}
