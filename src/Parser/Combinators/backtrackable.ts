import {Found,NotFound,Progress} from '../../data/ParseResult/ParseResult'
import {Parser} from '../Parser'

export function backtrackable<V>(parser: Parser<V>): Parser<V> {
  return Parser.of(s =>
    parser.parse(s).caseOf({
      notFound: nf => NotFound(Progress.ReturnedToStart, nf.problem),
      found: f => Found(Progress.ReturnedToStart, f.v, f.loc),
    })
  )
}
