import {Found,Progress} from '../../data/ParseResult/ParseResult'
import {Parser} from '../Parser'

export function optionally<V>(p: Parser<V>) {
  return Parser.of<V>(s =>
    p.parse(s).caseOf({
      found: f => Found<V>(f),
      notFound: () => Found<V>(Progress.ReturnedToStart, null, s),
    })
  )
}
