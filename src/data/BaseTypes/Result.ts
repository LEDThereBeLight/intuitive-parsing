/*

This code is adapted from the cbowdon/TsMonad library, which is under the MIT license.
I've extended the Either type to a Bifunctor.

Link: https://github.com/cbowdon/TsMonad as of 3/2022.

Copyright (c) 2014 Chris Bowdon

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

export enum ResultType {
  NotFound,
  Found,
}
export interface ResultPatterns<X, V, T> {
  notFound: (x: X) => T
  found: (v: V) => T
}

export type OptionalResultPatterns<X, V, T> = Partial<ResultPatterns<X, V, T>>

function exists<T>(t: T) {
  return t !== null && t !== undefined
}

export function result<X, V>(x?: X, v?: V) {
  if (exists(x) && exists(v))
    throw new TypeError('Cannot construct an Result with both a err and an ok')
  if (!exists(x) && !exists(v))
    throw new TypeError(
      'Cannot construct an Result with nResult a err nor an ok'
    )
  if (exists(x) && !exists(v)) return Result.notFound<X, V>(x)
  if (!exists(x) && exists(v)) return Result.found<X, V>(v)
}

export class Result<X, V> implements Monad<V>, Functor<V>, Eq<Result<X, V>> {
  constructor(private type: ResultType, private x?: X, private v?: V) {}
  static notFound<X, V>(x: X) {
    return new Result<X, V>(ResultType.NotFound, x)
  }
  static found<X, V>(v: V) {
    return new Result<X, V>(ResultType.Found, null, v)
  }
  isNotFound() {
    return this.caseOf({ notFound: () => true, found: () => false })
  }
  isFound() {
    return this.caseOf({ notFound: () => false, found: () => true })
  }
  unit<X, T>(t: T) {
    return Result.found<X, T>(t)
  }
  of = this.unit
  unitNotFound(x: X) {
    return Result.notFound(x)
  }
  ofNotFound = this.unitNotFound
  bind<T>(f: (v: V) => Result<X, T>) {
    return this.type === ResultType.Found
      ? f(this.v)
      : Result.notFound<X, T>(this.x)
  }
  chain = this.bind
  andThen = this.bind

  bindNotFound(f: (x: X) => Result<X, V>) {
    return this.type === ResultType.NotFound ? f(this.x) : Result.found(this.v)
  }

  fmap<_, T>(f: (v: V) => T) {
    return this.bind(v => this.unit(f(v)))
  }
  lift = this.fmap
  map = this.fmap
  fmapNotFound(f: (x: X) => X) {
    return this.bindNotFound(x => this.unitNotFound(f(x)))
  }
  liftNotFound = this.fmapNotFound
  mapNotFound = this.fmapNotFound

  caseOf<T>(pattern: ResultPatterns<X, V, T>) {
    return this.type === ResultType.Found
      ? pattern.found(this.v)
      : pattern.notFound(this.x)
  }
  equals(other: Result<X, V>) {
    return (
      other.type === this.type &&
      ((this.type === ResultType.NotFound && eq(other.x, this.x)) ||
        (this.type === ResultType.Found && eq(other.v, this.v)))
    )
  }
  // run a fn with side effects. returns original v.
  do(patterns: Partial<ResultPatterns<X, V, void>> = {}): Result<X, V> {
    const noop_pattern = {
      notFound: (_x: X) => {},
      found: (_v: V) => {},
    }
    const merged = Object.assign(noop_pattern, patterns)
    this.caseOf(merged)
    return this
  }
  withDefault(defaultValue: V) {
    return Result.found(this.valueOr(defaultValue))
  }
  valueOr<T extends V>(defaultValue: T): T | V {
    return this.valueOrCompute(() => defaultValue)
  }
  valueOrCompute<T extends V>(defaultValueFn: () => T): T | V {
    return this.type === ResultType.Found ? this.v : defaultValueFn()
  }
}

export function eq(a: any, b: any) {
  let idx = 0
  if (a === b) {
    return true
  }
  if (typeof a.equals === 'function') {
    return a.equals(b)
  }
  if (a.length > 0 && a.length === b.length) {
    for (; idx < a.length; idx += 1) {
      if (!eq(a[idx], b[idx])) {
        return false
      }
    }
    return true
  }
  return false
}

export interface Eq<T> {
  equals(t: T): boolean
}

export interface Monad<T> {
  unit<U>(t: U): Monad<U>
  bind<U>(f: (t: T) => Monad<U>): Monad<U>
  of<U>(t: U): Monad<U>
  chain<U>(f: (t: T) => Monad<U>): Monad<U>
}

export interface Functor<T> {
  fmap<U>(f: (t: T) => U): Functor<U>
  lift<U>(f: (t: T) => U): Functor<U>
  map<U>(f: (t: T) => U): Functor<U>
}
