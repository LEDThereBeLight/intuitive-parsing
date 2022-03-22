import { Bag } from './Bag'
import { Either } from './either'
import { Functor, Applicative, Monad } from './types'
const id = <T>(x: T): T => x

type State = {
  input: string
  offset: number
  indent: number
  row: number
  col: number
}

interface Ok<V> {
  p: boolean
  value: V
  state: State
}
interface Fail<X> {
  p: boolean
  reason: Bag<X>
}

const Fail = <X, V>(p: boolean, reason: Bag<X>) =>
  Either.fail<Fail<X>, Ok<V>>({ p, reason })

const Ok = <X, V>(p: boolean, value: V, state: State) =>
  Either.ok<Fail<X>, Ok<V>>({ p, value, state })

type Step<X, V> = Either<Fail<X>, Ok<V>>
type Parse<X, V> = (s: State) => Step<X, V>

class Parser<X, V> implements Functor<V>, Applicative<V>, Monad<V> {
  static of = <X, V>(parse: Parse<X, V>) => new Parser<X, V>(parse)
  // these MUST instantiate the parser with a function to make
  // it an applicative.
  static succeed = <X, V>(val: V) => Parser.of(s => Ok<X, V>(false, val, s))
  static fail = <X, V>() =>
    Parser.of(() => Fail<X, V>(false, Bag.AddRight<X>()))

  constructor(public parse: Parse<X, V>) {}

  chain<X, B>(f: (a: V) => Parser<X, B>): Parser<X, B> {
    return Parser.of(s => this.parse(s).bind(ok => f(ok.value).parse(ok.state)))
  }
  andThen = this.chain
  thenGiveResultTo = this.chain
  bind = this.chain

  map2<A, B, C>(
    this: Parser<X, A>,
    f: (a: A, b: B) => C,
    parser: Parser<X, B>
  ): Parser<X, C> {
    return Parser.of(s =>
      this.parse(s).bind(ok1 =>
        parser
          .parse(ok1.state)
          .bind(ok2 => Ok(ok1.p || ok2.p, f(ok1.value, ok2.value), ok2.state))
      )
    )
  }

  apply<A, B>(this: Parser<X, (a: A) => B>, p: Parser<X, A>): Parser<X, B> {
    return this.map2((a, b) => a(b), p)
  }
  thenKeep = this.apply
  thenIgnore = <A>(p: Parser<A, X>) => this.map2(id, p)

  map<B>(f: (x: V) => B): Parser<X, B> {
    return Parser.of(s =>
      this.parse(s).bind(ok => Ok(ok.p, f(ok.value), ok.state))
    )
  }

  symbol = token
  token() {}

  keyword(keyword: Token<string>, expecting: Parser<X, null>) {
    return Parser.of(s => {
      const progress = keyword !== ''
      const [offset, row, col] = isSubstring(
        keyword.value,
        s.offset,
        s.row,
        s.col,
        s.input
      )
      if (offset === -1 || isSubChar(c => c.))
    })
  }

  oneOf<X, V>(parsers: Parser<X, V>[]): Parser<X, V> {
    return Parser.of(s => go(s))

    // TODO: Trampoline this
    function go(s: State, b = Bag.Empty<X>(), i = 0): Step<X, V> {
      if (i === parsers.length) return Fail(false, b)
      return parsers[i].parse(s).caseOf<Step<X, V>>({
        ok: ok => Ok(ok.p, ok.value, ok.state),
        fail: fail =>
          fail.p
            ? Fail(fail.p, fail.reason)
            : go(s, b.Append(fail.reason), i + 1),
      })
    }
  }

  static lazily = <X, V>(thunk: () => Parser<X, V>) =>
    Parser.of(s => thunk().parse(s))
}
const of = Parser.of

type Token<V> = { t: 'token'; value: V; reason: string }



// bool keeps track of progress to prevent infinite loops

function backtrackable<X, V>(parser: Parser<X, V>): Parser<X, V> {
  return Parser.of(s =>
    parser.parse(s).caseOf({
      fail: fail => Fail(false, fail.reason),
      ok: ok => Ok(false, ok.value, ok.state),
    })
  )
}

function commit<X, V>(a: V): Parser<X, V> {
  return Parser.of(s => Ok(true, a, s))
}

type Loop<State, V> = { t: 'loop'; state: State } | { t: 'done'; value: V }

function loop<X, V>(
  state: State,
  toParser: (s: State) => Parser<X, Loop<State, V>>
): Parser<X, V> {
  return Parser.of(s => go(false, state, toParser, s))

  function go(
    p: boolean,
    state: State,
    toParser: (s: State) => Parser<X, Loop<State, V>>,
    s0: State
  ) {
    return toParser(state)
      .parse(s0)
      .caseOf({
        fail: fail => Fail(p || fail.p, fail.reason),
        ok: ok =>
          ok.value.t === 'done'
            ? Ok(p || ok.p, ok.value, ok.state)
            : go(p || ok.p, ok.state, toParser, ok.state),
      })
  }
}

type Offset = number
type Row = number
type Col = number
type ChompResult = [Offset, Row, Col]
const isSubstring = (
  target: string,
  offset: number,
  row: number,
  col: number,
  source: string
): ChompResult => {
  let ok = offset + target.length <= source.length

  let i = 0
  while (ok && i < target.length) {
    const code = target.charCodeAt(offset)
    if (target[i++] === source[offset++] && code === 10) {
      row += 1
      col = 1
      ok = true
    } else if ((code & 0xf800) === 0xd800) {
      if (target[i++] === source[offset++]) {
      }
    }
    ok =
      target[i++] === source[offset++] && code === 10
        ? ((row += 1), (col = 1), true)
        : ((col += 1), (code & 0xf800) === 0xd800 ? 1 : true)
  }
  return [ok ? offset : -1, row, col]
}
type Char = string
const FAIL = -1
const NEWLINE = -2
const isSubchar = (
  p: (c: Char) => boolean,
  offset: Offset,
  input: string
): Offset => {

}

type CodePoint = number
const isAscii = (code: CodePoint, offset: Offset, input: string): boolean => {

}

// Translate native JavaScript String methods to give more context about their results by including the row and column in the input string where the match was either found or not. The offset is where we start the search, and the returned offset is the "index" into the string where the match was found.
// The ECMAScript standard specifies that each element in a string should be considered to be a single UTF-16 code unit. That is, while source files can have any encoding, the JavaScript runtime should convert it internally to UTF-16 before executing it. That means we can assume each codepoint is represented by a 16-bit number.
// Characters in the range:
// 0xD800 === 1101100000000000
// to...
// 0xDFFF === 1101111111111111
// represent surrogate codepoints.

// If by &ing the codepoint with the number:
// 0xF800 === 1111100000000000
// we receive 0xD800, the codepoint is somewhere in the surrogate range. So it does not represent an actual "character," but rather the second half of a codepoint pair. We only want to count each pair as one character, so if the codepoint is in this range we increment the offset and ignore it.

// https://exploringjs.com/impatient-js/ch_unicode.html
const findSubstring = (target: string, offset: Offset, row: Row, col: Col, input: string): ChompResult => {
  const newPosition = input.indexOf(target, offset)
  const lastPossiblePosition = newPosition < 0 ? input.length : newPosition + target.length

  while (offset < lastPossiblePosition) {
    let code = input.charCodeAt(offset++)
    code === 10 /* \n */
      ? (col = 1, row++) /* new row */
       : (col++, (code  & 0xF800 ) === 0xD800 && offset++)
  }
  return [newPosition, row, col]
}
