declare type Nil = []
declare type List<T = any> = [T, List<T>] | Nil

declare type Tokens = List<Token>
declare type Token = string

declare type Parser<R> = (ts: Tokens) => ParseSuccess<R>[] | ParseFail
declare type Parse<R> = ParseSuccess<R>[] | ParseFail
declare type ParseSuccess<R> = [R, Tokens]
declare type ParseFail = Nil

declare type Expr = number | Binop
declare type Binop = {
  t: "binop"
  op: string
  l: Expr
  r: Expr
}
declare type PartialBinop = {
  t: "partialbinop"
  op: string
  r: Expr
}

type Lexer = (chars: List<string>) => string
type Predicate<T = any> = (x: T) => boolean
