import {Parser} from '../Parser'

export function lazily<V>(thunk: () => Parser<V>) {
  return Parser.of(s => thunk().parse(s))
}
