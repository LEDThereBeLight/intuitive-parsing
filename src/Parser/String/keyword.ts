import Directions from '../../data/Directions'
import {Found,NotFound,Progress} from '../../data/ParseResult/ParseResult'
import {isAlphaNumeric,isSubstring,matchChar} from '../Core/ParserCore'
import {Parser} from '../Parser'
import {Token} from './../../data/globals'

export function keyword<V>(keyword: Token<string>, expecting: Parser<null>) {
  return Parser.of(s => {
    const { index, row, col } = isSubstring(
      keyword.v,
      s.index,
      s.row,
      s.col,
      s.input
    )

    const pred = c => isAlphaNumeric(c) || c === '_'

    if (index === -1 || matchChar(pred, index, s.input) >= 0)
      // Write util to convert s and expecting to a DeadEnd type
      return NotFound<V>(
        Progress.ReturnedToStart,
        Directions.hitDeadend(s, expecting)
      )

    return Found<V>(
      keyword.v === '' ? Progress.ReturnedToStart : Progress.MovedForward,
      null,
      { ...s, index, row, col }
    )
  })
}
