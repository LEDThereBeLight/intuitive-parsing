import {Parser} from './Parser'

export function bind<V, V1>(f: (a: V) => Parser<V1>): Parser<V1> {
  return Parser.of(s => this.parse(s).bind(f => f(ok.v).parse(ok.state)))
}
export const chain = bind
export const then = bind
export const thenPipeInto = bind
