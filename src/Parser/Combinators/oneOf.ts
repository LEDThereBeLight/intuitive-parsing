import Directions from '../../data/Directions'
import {Location} from '../../data/Location'
import {Found,NotFound,Progress} from '../../data/ParseResult/ParseResult'
import {Parser} from '../Parser'
import {ParseResult} from './../data/Result/ParseResult'

export function oneOf<V>(parsers: Parser<V>[]): Parser<V> {
  return Parser.of(s => go(s))

  // TODO: Trampoline this
  function go(l: Location, dir = Directions.empty(), i = 0): ParseResult<V> {
    if (i === parsers.length) return NotFound(Progress.ReturnedToStart, dir)
    return parsers[i].parse(l).caseOf({
      found: f => Found<V>(f),
      notFound: nf =>
        nf.p
          ? NotFound<V>(nf)
          : go(l, Directions.tookFork(nf.problem, dir), i + 1),
    })
  }
}

export const any = oneOf
