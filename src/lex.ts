import {
  dropWhile,
  Either,
  Err,
  List,
  Ok,
  takeWhile,
  toString,
} from "./utils"



const isDigit: Predicate = s => Number.isInteger(Number(s))
const isntDigit: Predicate = s => !isDigit(s)
const lexNum: Lexer = ss => toString(takeWhile(isDigit, ss))
const lexOp: Lexer = ss => toString(takeWhile(isntDigit, ss))

export const lex = (cs: List, lexed = []): Either<List> => {
  const [c] = cs

  if (cs.length === 0) return Ok(List(lexed))
  if (c.length > 1)
    return Err(`A multi-character '${c}' was given to the lexer`)

  if (isDigit(c)) return lex(dropWhile(isDigit, cs), lexed.concat(lexNum(cs)))

  return lex(dropWhile(isntDigit, cs), lexed.concat(lexOp(cs)))
}
