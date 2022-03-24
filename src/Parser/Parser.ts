import {DeadEnd} from '../data/DeadEnd'
import Directions from '../data/Directions'
import {Look} from '../data/globals'
import {Found,NotFound} from '../data/ParseResult/ParseResult'
import {Result} from './../data/BaseTypes/Result'

// implements Functor<V>, Applicative<V>, Monad<V>
export class Parser<V> {
  static of = <V>(parse: Look<V>) => new Parser<V>(parse)
  // these MUST instantiate the parser with a function to make
  // it an applicative. Change types to fns?
  // succeed == "Look for" something
  static succeed = <V>(val: V) => Parser.of(s => Found<V>(false, val, s))
  static create = Parser.succeed
  static make = Parser.succeed
  // Convert to new helpers
  static err = <V>() => Parser.of(() => NotFound<V>(false, Directions.hitDeadend()))

  constructor(public parse: Look<V>) {}
}

export function run<V>(p: Parser<V>, input: string): Result<DeadEnd, V> {
  return p.parse({ col: 1, row: 1, index: 0, input }).caseOf({
    found: f => Result.found(f.v),
    notFound: nf => Result.notFound(nf.problem),
  })
}
