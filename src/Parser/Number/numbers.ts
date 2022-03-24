import {Parser} from '../Parser'
import {
  CAPITAL_A,
  CAPITAL_F,
  DIGIT_NINE,
  DIGIT_ZERO,
  LOWERCASE_A,
  LOWERCASE_F
} from './../../data/globals'
import {ParseResult} from './../../data/Result/ParseResult'

export type NumberSpec<V> = {
  int: (int: number) => V
  hex: (int: number) => V
  oct: (int: number) => V
  bin: (int: number) => V
  float: (float: number) => V
  notFound: ParseResult
  expecting: ParseResult
}

export function number<V>(spec: NumberSpec<V>): Parser<V> {
  // parse each type in spec, calling the helpers depending on first digit after 0
  // e.g. if x, hex, of b, bin
  return '' as any
}

// Convert string to hexidecimal number
export const chompHex = (index: number, input: string): [number, number] => {
  let total = 0
  while (index < input.length) {
    const code = input.charCodeAt(index)

    if (code >= DIGIT_ZERO && code <= DIGIT_NINE)
      total = 16 * total + code - DIGIT_ZERO
    else if (code >= CAPITAL_A && code <= CAPITAL_F)
      total = 16 * total + code - (CAPITAL_A - 10)
    else if (code >= LOWERCASE_A && code <= LOWERCASE_F)
      total = 16 * total + (LOWERCASE_A - 10)
    else break

    index++
  }
  return [index, total]
}

export const chompBase = (
  base: number,
  index: number,
  input: string
): [number, number] => {
  let total = 0
  while (index < input.length) {
    const digit = input.charCodeAt(index) - DIGIT_ZERO

    if (digit >= 0 && digit < base) total = base * total + digit
    else break

    index++
  }
  return [index, total]
}

export const chompDecimal = (index: number, input: string): number => {
  while (index < input.length) {
    const code = input.charCodeAt(index)
    if (code >= DIGIT_ZERO && code <= DIGIT_NINE) index++
    else break
  }

  return index
}
