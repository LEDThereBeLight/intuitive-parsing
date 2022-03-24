import {Location} from './Location'
import {ParseResult} from './ParseResult/ParseResult'

export type MovedForward = boolean

export type Look<V> = (loc: Location) => ParseResult<V>
export type Char = string
export type Token<V> = { t: 'token'; v: V; problem: string }
export type Row = number
export type Col = number
export type ChompResult = { index: number; row: Row; col: Col }
export type CodePoint = number

export const FAIL = -1
export const FOUND_NEWLINE = -2
export const HIGH_SURROGATE_START = 0xd800
export const _HIGH_SURROGATE_END = 0xdfff
export const HIGH_SURROGATE_BITMASK = 0xf800
export const DIGIT_ZERO = 0x30
export const DIGIT_NINE = 0x39
export const CAPITAL_A = 0x41
export const CAPITAL_F = 0x46
export const CAPITAL_Z = 0x5a
export const LOWERCASE_A = 0x61
export const LOWERCASE_F = 0x66
export const LOWERCASE_Z = 0x7a
export const NEWLINE = 0xa
