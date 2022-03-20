export const List = <T>(xs: T[]): List<T> => {
  let linked: List<T> = []
  for (let i = xs.length - 1; i >= 0; i--) linked = [xs[i], linked]
  return linked
}

export const takeWhile = <T>(p: Predicate<T>, [x, xs]: List<T>): List<T> => {
  if (x === undefined || !p(x)) return []
  return [x, takeWhile(p, xs)]
}

export const dropWhile = <T>(p: Predicate<T>, [x, xs]: List<T>): List<T> => {
  if (x === undefined) return []
  if (p(x)) return dropWhile(p, xs)
  return xs
}

export const toString = ([x, xs]: List): string => {
  if (x === undefined) return ""
  return x + toString(xs)
}

// Poor man's monad
export interface Either<T> {
  then: (f: (x: any) => Either<T>) => Either<T>
  caseOf: (spec: { ok: (x: any) => any; err: () => any }) => any
  lift: (f) => Either<T>
}
export const Ok = <T>(val) => Either<T>({ t: "ok", val })
export const Err = val => Either({ t: "err", val: new Error(val) })

const Either = <T>(x: { t: "ok" | "err"; val: T }): Either<T> => {
  const caseOf = ({ ok, err }) => (x.t === "ok" ? ok(x.val) : err(x.val))

  return {
    then: f =>
      caseOf({
        ok: f,
        err: Err,
      }),
    caseOf,
    lift: f =>
      caseOf({
        ok: ok => Ok(f(ok)),
        err: Err,
      }),
  }
}

// Parse utils
const fail = <R>(r: ParseSuccess<R>[] | ParseFail): r is ParseFail =>
  r.length === 0
const ok = <R>(r: ParseSuccess<R>[] | ParseFail): r is ParseSuccess<R>[] =>
  !fail(r)

const Or =
  <R>(...ps: Parser<R>[]): Parser<R> =>
  toks =>
    ps.flatMap(p => p(toks))

const Empty: Parser<[]> = toks => [[[], toks]]
console.assert(Empty(List(["a", "b", "c"])) == [])

const Maybe = <R>(p: Parser<R>) => Or<R | []>(p, Empty)

const ZeroOrMore = <R>(p: Parser<R>): Parser<R[]> => Or(OneOrMore(p), Empty)

function OneOrMore<R>(p: Parser<R>): Parser<R[]> {
  return toks => {
    const firsts = p(toks)
    if (fail(firsts)) return []

    return firsts.flatMap(([r1, toks1]) => {
      const seconds = ZeroOrMore(p)(toks1)
      if (fail(seconds)) return [[r1], toks1]
      return seconds.map(([r2s, toks]) => [[r1].concat(r2s), toks])
    })
  }
}

const Match =
  <R>(s: any): Parser<R> =>
  toks => {
    if (toks.length === 0 || toks[0] !== s) return []
    return [[s, toks[1]]]
  }

const Map =
  <R, S>(f: (r: R) => S, p: Parser<R>): Parser<S> =>
  toks => {
    const parses = p(toks)
    if (fail(parses)) return []
    return parses.map(([r, toks]) => [f(r), toks])
  }

const Seq =
  <R1, R2>(p1: Parser<R1>, p2: Parser<R2>): Parser<[R1, R2]> =>
  toks => {
    const parses = p1(toks)
    if (fail(parses)) return []
    return parses.flatMap(([res, toks]) => {
      const rest = p2(toks)
      if (fail(rest)) return []
      return rest.map(([res2, toks2]) => [[res, res2] as [R1, R2], toks2])
    })
  }

export const P = {
  Or,
  Empty,
  Maybe,
  ZeroOrMore,
  OneOrMore,
  Match,
  Map,
  Seq,
  ok,
  fail,
}
