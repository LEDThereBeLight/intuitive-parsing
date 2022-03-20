import { evaluate } from "./evaluate"
import { lex } from "./lex"
import { normalize } from "./normalize"
import { parse } from "./parse"
import { List, Ok } from "./utils"

const calculate = input =>
  Ok(List(input)).then(normalize).then(lex).then(parse).lift(evaluate).caseOf({
    ok: console.log,
    err: console.error,
  })

calculate(["1"])

// calculate([
//   // '-',
//   '1',
//   '2',
//   '*',
//   '2',
//   '<backspace>',
//   '5',
//   '/',
//   '7',
//   '1',
//   '/',
//   '5',
//   '4',
//   '=',
// ])
