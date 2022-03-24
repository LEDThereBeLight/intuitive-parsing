import Directions from '../../data/Directions'
import {Found,NotFound,Progress} from '../../data/ParseResult/ParseResult'
import {isSubstring} from '../Core/ParserCore'
import {Parser} from '../Parser'
import {Token} from './../../data/globals'

export function token(token: Token<string>) {
  return Parser.of<string>(s => {
    const { index, row, col } = isSubstring(
      token.v,
      s.index,
      s.row,
      s.col,
      s.input
    )

    // write util to make DeadEnd from s and token.problem
    if (index === -1)
      return NotFound(
        Progress.ReturnedToStart,
        Directions.hitDeadend(s, token.problem)
      )
    return Found(
      token.v === '' ? Progress.ReturnedToStart : Progress.MovedForward,
      null,
      { ...s, index, row, col }
    )
  })
}
export const symbol = token
