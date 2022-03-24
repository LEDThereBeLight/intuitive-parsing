import {
  CAPITAL_A,
  CAPITAL_Z,
  Char,
  ChompResult,
  CodePoint,
  Col,
  DIGIT_NINE,
  DIGIT_ZERO,
  FAIL,
  FOUND_NEWLINE,
  HIGH_SURROGATE_BITMASK,
  HIGH_SURROGATE_START,
  LOWERCASE_A,
  LOWERCASE_Z,
  NEWLINE,
  Row
} from '../../data/globals'

declare module '../Parser' {
  export interface Parser<V> {
    eatCharIf: () => Parser<string>
    eatCharWhile: (p: (c: Char) => boolean) => Parser<string>
    eatString: () => Parser<string>
    eatStringMap: () => Parser<string>

    // word() -> separated string
    // string() -> doesnt matter what comes next
  }
}

// Translate native JavaScript String methods to give more context about their results by including the row and column in the input string where the match was either found or not. The index is where we start the search, and the returned index is the "index" into the string where the match was found.
// The ECMAScript standard specifies that each element in a string should be considered to be a single UTF-16 code unit. That is, while source files can have any encoding, the JavaScript runtime should convert it internally to UTF-16 before executing it. That means we can assume each codepoint is represented by a 16-bit number.

/*

*/
export const isSubstring = (
  target: string,
  index: number,
  row: number,
  col: number,
  source: string
): ChompResult => {
  let ok = index + target.length <= source.length
  let i = 0

  while (ok && i < target.length) {
    const code = target.charCodeAt(index)

    if (target[i++] === source[index++] && code === NEWLINE) row++, (col = 1)
    else col += 1

    if ((code & HIGH_SURROGATE_BITMASK) === HIGH_SURROGATE_START)
      ok = target[i++] === source[index++]
  }

  return { index: ok ? index : FAIL, row, col }
}

export const matchChar = (
  p: (c: Char) => boolean,
  index: number,
  input: string
): number => {
  if (input.length <= index) return FAIL
  if (
    (input.charCodeAt(index) & HIGH_SURROGATE_BITMASK) ===
    HIGH_SURROGATE_START
  ) {
    if (p(input.substring(index, index + 2))) return index + 2
    return FAIL
  }
  if (p(input[index])) {
    if (input.charCodeAt(index) === NEWLINE) return FOUND_NEWLINE
    return index + 1
  }
  return FAIL
}

// Characters in the range:
// 0xD800 === 1101100000000000
// to...
// 0xDFFF === 1101111111111111
// represent surrogate codepoints.

// If by &ing the codepoint with the number:
// 0xF800 === 1111100000000000
// we receive 0xD800, the codepoint is somewhere in the surrogate range. So it does not represent an actual "character," but rather the second half of a codepoint pair. We only want to count each pair as one character, so if the codepoint is in this range we increment the index and ignore it.

// https://exploringjs.com/impatient-js/ch_unicode.html
export const findSubstring = (
  target: string,
  index: number,
  row: Row,
  col: Col,
  input: string
): ChompResult => {
  let end = input.length

  const newIndex = input.indexOf(target, index)
  if (newIndex >= 0) end = newIndex + target.length

  while (index < end) {
    const code = input.charCodeAt(index)

    index++
    if (code === NEWLINE) {
      col = 1
      row++
    } else col++

    // Is the codepoint the "second half" of a surrogate pair (represented by two UTF-16 codepoints)? If so, we don't want to count it, because we already counted the low surrogate.
    if ((code & HIGH_SURROGATE_BITMASK) === HIGH_SURROGATE_START) index++
  }
  return { index: newIndex, row, col }
}

export const isAscii = (
  code: CodePoint,
  index: number,
  input: string
): boolean => {
  return input.charCodeAt(index) === code
}

export const isAlphaNumeric = (input: string, index = 0): boolean => {
  while (index < input.length) {
    const code = input.charCodeAt(index)
    if (
      (code >= DIGIT_ZERO && code <= DIGIT_NINE) ||
      (code >= CAPITAL_A && code <= CAPITAL_Z) ||
      (code >= LOWERCASE_A && code <= LOWERCASE_Z)
    )
      return true
    index++
  }
  return false
}
