import {Result} from '../BaseTypes/Result'
import {Location} from '../Location'
import {DeadEnd} from './../DeadEnd'

// Types

export type ParseResult<V> = Result<NotFound, Found<V>>
export interface Found<V> {
  p: Progress
  v: V
  loc: Location
}
export interface NotFound {
  p: Progress
  problem: DeadEnd
}
export enum Progress {
  MovedForward = 1,
  ReturnedToStart = 2,
}

// Constructors

export function NotFound<V>(
  data: Progress | NotFound,
  problem?: DeadEnd
): ParseResult<V> {
  if (typeof data === 'number') return Result.notFound({ p: data, problem })
  return Result.notFound(data)
}

export function Found<V>(
  data: Progress | Found<V>,
  v?: V,
  loc?: Location
): ParseResult<V> {
  if (typeof data === 'number') return Result.found({ p: data, v, loc })
  return Result.found(data)
}
