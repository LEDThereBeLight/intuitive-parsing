import {Found,Progress} from '../../data/ParseResult/ParseResult'
import {Parser} from '../Parser'

export function commitToPath<V>(a: V): Parser<V> {
  return Parser.of(s => Found(Progress.MovedForward, a, s))
}
