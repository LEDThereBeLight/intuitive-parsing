import {Found} from '../data/ParseResult/ParseResult'
import {Parser} from './Parser'

export function map<V, V1>(p: Parser<V>, f: (x: V) => V1): Parser<V1> {
  return Parser.of(s =>
    p.parse(s).bind(found => Found(found.p, f(found.v), found.loc))
  )
}

export function map2<A, B, C>(
  p1: Parser<A>,
  f: (a: A, b: B) => C,
  p2: Parser<B>
): Parser<C> {
  return Parser.of(s =>
    p1
      .parse(s)
      .bind(ok1 =>
        p2
          .parse(ok1.loc)
          .bind(ok2 => Found(ok1.p || ok2.p, f(ok1.v, ok2.v), ok2.loc))
      )
  )
}
