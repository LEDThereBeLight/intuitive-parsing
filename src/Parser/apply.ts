import {map2} from './map'
import {Parser} from './Parser'

export function apply<V0, V1>(
  p1: Parser<(a: V0) => V1>,
  p2: Parser<V0>
): Parser<V1> {
  return map2(p1, (a, b) => a(b), p2)
}
export const keeping = apply
export const from = apply
