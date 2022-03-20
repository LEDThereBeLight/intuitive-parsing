import { Either, Err, List, Ok } from "./utils"

const isTerminal = (tok: Token) => tok === "="
const isBackspace = (tok: Token) => tok === "<backspace>"

export const normalize = (toks: List, normalized = []): Either<List> => {
  if (toks.length === 0) return Ok(List(normalized))

  const [tok, rest] = toks
  if (isTerminal(tok)) return Ok(List(normalized))
  if (isBackspace(tok)) {
    if (normalized.length === 0) {
      return Err("Invalid <backspace>")
    } else {
      normalized.pop()
    }
  } else normalized.push(tok)
  return normalize(rest, normalized)
}
