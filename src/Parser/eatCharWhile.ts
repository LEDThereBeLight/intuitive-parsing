import {Found,Progress} from '../data/ParseResult/ParseResult'
import {matchChar} from './Core/ParserCore'
import {Parser} from './Parser'

export function eatCharWhile<V>(p: (char: string) => boolean) {
  return Parser.of<V>(s0 => {
    // TODO: Trampoline
    function go(index0: number, row = s0.row, col = s0.col, s = s0) {
      const index = matchChar(p, s.index, s.input)
      if (index === -1)
        return Found<V>(
          index > s0.index ? Progress.MovedForward : Progress.ReturnedToStart,
          null,
          s
        )
      if (index === -2) return go(index + 1, row + 1, 1, s)
      return go(index, row, col + 1, s)
    }
    return go(s0.index)
  })
}
