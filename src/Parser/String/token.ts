import Directions from '../../data/Directions'
import {Found,NotFound,Progress} from '../../data/ParseResult/ParseResult'
import {isSubstring} from '../Core/ParserCore'
import {Parser} from '../Parser'
import {Token} from './../../data/globals'

export function token(token: Token<string>) {
  return Parser.of<string>(l => {
    const { index, row, col } = isSubstring(
      token.v,
      l.index,
      l.row,
      l.col,
      l.input
    )

    // write util to make DeadEnd from l and token.problem
    if (index === -1)
      return NotFound(
        Progress.ReturnedToStart,
        Directions.hitDeadend(l, token.problem)
      )

    return Found(
      token.v === '' ? Progress.ReturnedToStart : Progress.MovedForward,
      null,
      { ...l, index, row, col }
    )
  })
}
export const symbol = token
