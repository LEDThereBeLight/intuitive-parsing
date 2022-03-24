import {Parser} from '../Parser'

const id = <a>(x: a): a => x

export function ignoring<V>(p: Parser<V>) {
  return this.map2(id, p)
}
