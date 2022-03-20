import { binopAp, partialBinopAp } from "./evaluate"
import { Either, Err, Ok, P } from "./utils"
import { printExpr } from "./prettyPrinter"

/*
<- BNF ->
Calculation = AddSub | MulDiv | Num
AddSub = Calculation ("+" | "-") Calculation
MulDiv = (MulDiv | Num) ("*" | "/") (MulDiv | Num)
Num = [0..9]+

<- Without left recursion ->
Expr = Calc1

Calc1 = Calc2 End1
End1 = PlusMinus Calc1 | Empty

Calc2 = Num End2
End2 = MulDiv Calc2 | Empty

PlusMinus = ("+" | "-")
MulDiv = ("*" | "/")
Num = [0..9]+
*/

function Expr(toks: Tokens) {
  return Calc1(toks)
}

const binopFromPartial = ([n, end]) => {
  if (Array.isArray(end)) return n
  const { op, r } = end
  return binopAp([n, op, r])
}

function Calc1(toks: Tokens): Parse<Binop | number> {
  return P.Map<[number | Binop, [] | PartialBinop], Binop | number>(
    binopFromPartial,
    P.Seq(Calc2, End1)
  )(toks)
}
function End1(toks: Tokens): Parse<PartialBinop | []> {
  return P.Or<PartialBinop | []>(
    P.Map(partialBinopAp, P.Seq(PlusMinus, Calc1)),
    P.Empty
  )(toks)
}

function Calc2(toks: Tokens): Parse<Binop | number> {
  return P.Map<[number, [] | PartialBinop], Binop | number>(
    binopFromPartial,
    P.Seq(Num, End2)
  )(toks)
}
function End2(toks: Tokens): Parse<PartialBinop | []> {
  return P.Or<PartialBinop | []>(
    P.Map(partialBinopAp, P.Seq(MulDiv, Calc2)),
    P.Empty
  )(toks)
}

function PlusMinus(toks: Tokens) {
  return P.Or(P.Match<"+">("+"), P.Match<"-">("-"))(toks)
}
function MulDiv(toks: Tokens) {
  return P.Or(P.Match<"*">("*"), P.Match<"/">("/"))(toks)
}
function Num(toks: Tokens): Parse<number> {
  if (toks.length === 0) return []
  // console.log("pNum", tok)
  // console.log(Number.isInteger(makeNum(tok)) ? [[makeNum(tok), toks]] : [])
  if (Number.isInteger(Number(toks[0]))) return [[Number(toks[0]), toks[1]]]
  return []
}

export const parse = (toks: List): Either<Token[]> => {
  const parsed = Expr(toks).filter(P.ok)
  if (P.fail(parsed)) return Err("Invalid parse: " + JSON.stringify(Expr(toks)))

  const [[firstResult]] = parsed
  console.log(printExpr(firstResult))
  return Ok(firstResult)
}
