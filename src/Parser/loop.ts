import {Location} from '../data/Location'
import {NotFound} from '../data/ParseResult/ParseResult'
import {Found} from './../data/Result/ParseResult'
import {Parser} from './Parser'

type Status<Acc, V> = { t: 'not_done'; acc: Acc } | { t: 'done'; v: V }

export function loop<Acc, V>(
  acc: Acc,
  step: (acc: Acc) => Parser<Status<Acc, V>>
): Parser<V> {
  return Parser.of(s => go(false, acc, step, s))

  function go(
    p: boolean,
    acc: Acc,
    step: (acc: Acc) => Parser<Status<Acc, V>>,
    s0: Location
  ) {
    return step(acc)
      .parse(s0)
      .caseOf({
        // Convert progress to helpers
        notFound: nf => NotFound(p || nf.p, nf.problem),
        found: f =>
          f.v.t === 'done'
            ? Found(p || f.p, f.v, f.loc)
            : go(p || f.p, f.loc, step, f.loc),
      })
  }
}
