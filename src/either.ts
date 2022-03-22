import { Monad, Functor, Eq, eq } from './monad'

export enum EitherType {
  Fail,
  Ok,
}
export interface EitherPatterns<X, V, T> {
  fail: (x: X) => T
  ok: (v: V) => T
}

export type OptionalEitherPatterns<X, V, T> = Partial<EitherPatterns<X, V, T>>

function exists<T>(t: T) {
  return t !== null && t !== undefined
}

export function either<X, V>(x?: X, v?: V) {
  if (exists(x) && exists(v))
    throw new TypeError('Cannot construct an Either with both a fail and an ok')
  if (!exists(x) && !exists(v))
    throw new TypeError(
      'Cannot construct an Either with neither a fail nor an ok'
    )
  if (exists(x) && !exists(v)) return Either.fail<X, V>(x)
  if (!exists(x) && exists(v)) return Either.ok<X, V>(v)
}

export class Either<X, V> implements Monad<V>, Functor<V>, Eq<Either<X, V>> {
  constructor(private type: EitherType, private x?: X, private v?: V) {}
  static fail<X, V>(x: X) {
    return new Either<X, V>(EitherType.Fail, x)
  }
  static ok<X, V>(v: V) {
    return new Either<X, V>(EitherType.Ok, null, v)
  }
  isFail() {
    return this.caseOf({ fail: () => true, ok: () => false })
  }
  isOk() {
    return this.caseOf({ fail: () => false, ok: () => true })
  }
  unit<T>(t: T) {
    return Either.ok<X, T>(t)
  }
  bind<T>(f: (v: V) => Either<X, T>) {
    return this.type === EitherType.Ok ? f(this.v) : Either.fail<X, T>(this.x)
  }
  of = this.unit
  chain = this.bind
  fmap<T>(f: (v: V) => T) {
    return this.bind(v => this.unit<T>(f(v)))
  }
  lift = this.fmap
  map = this.fmap
  caseOf<T>(pattern: EitherPatterns<X, V, T>) {
    return this.type === EitherType.Ok
      ? pattern.ok(this.v)
      : pattern.fail(this.x)
  }
  equals(other: Either<X, V>) {
    return (
      other.type === this.type &&
      ((this.type === EitherType.Fail && eq(other.x, this.x)) ||
        (this.type === EitherType.Ok && eq(other.v, this.v)))
    )
  }
  do(patterns: Partial<EitherPatterns<X, V, void>> = {}): Either<X, V> {
    const noop_pattern = {
      fail: (x: X) => {},
      ok: (v: V) => {},
    }
    const merged = Object.assign(noop_pattern, patterns)
    this.caseOf(merged)
    return this
  }
}
