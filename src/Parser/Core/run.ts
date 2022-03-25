import {Result} from '../../data/BaseTypes/Result'
import Directions from '../../data/Directions'
import {Parser} from '../Parser'

export interface Location {
  input: string

  index: number

  row: number
  col: number
}
const origin = (input: string): Location => ({
  input,
  index: 0,
  row: 1,
  col: 1,
})

export function run<V>(parser: Parser<V>, input: string) {
  parser.parse(origin(input))
    .caseOf({
      found: f => Result.found(f.v),
      notFound: nf => Result.notFound(Directions.toList(nf.))
    })
}
